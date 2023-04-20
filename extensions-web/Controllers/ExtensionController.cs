using Microsoft.AspNetCore.Mvc;
using Semver;
using System.Diagnostics.CodeAnalysis;

[Route("[controller]")]
[ApiController]
public class ExtensionController : ControllerBase
{
    [HttpGet("/extension")]
    [ResponseCache(Duration = 60)]
    public IActionResult GetExtensions(bool prerelease = false)
    {
        var packagesList = GetPreReleasePackages(prerelease);

        if (packagesList.Count() <= 0)
            return NoContent();

        return Ok(packagesList);
    }

    [HttpGet]
    [Route("{id}/{version?}")]
    public IActionResult GetExtension(string id, string version = "", bool prerelease = false)
    {
        var packages = _databaseService
           .Find(p => p.Identifier == id)
             .OrderByDescending(r => GetVersion(r.Version));

        return Ok(packages);
    }

    [HttpGet]
    [Route("targets/{id}/{version?}")]
    public IActionResult GetTargets(string id, string version = "")
    {
        var targets = _databaseService
           .Find(p => p.Identifier == id && p.Version == version)
           .Where(p => p.Metadata.Identity.TargetPlatform != null)
           .Select(p => p.Metadata.Identity.TargetPlatform)
           .ToList();

        return Ok(targets);
    }

    [HttpPost, DisableRequestSizeLimit]
    public async Task<IActionResult> AddExtensionsAsync(IFormFile file)
    {
        //read api key from request header
        if (RequireUploadAPIKey)
        {
            string apiKey = Request.Headers["x-api-key"];
            if (string.IsNullOrWhiteSpace(apiKey) || apiKey != UploadAPIKey)
                return Unauthorized("Missing or invalid API key");
        }

        string filePath = file.FileName;
        if (!IsExtensionAllowed(filePath))
            return BadRequest("Bad extension");

        string uploadDirectory = Utilities.UploadDirectory(_environment);

        string fileOnServer = Path.Combine(uploadDirectory, filePath);
        using (var fileStream = new FileStream(fileOnServer, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        var package = _manifestReader.ExtractPackage(fileOnServer);

        try
        {
            var result = _databaseService.InsertPackage(package);
        }
        catch (LiteDB.LiteException exception)
        {
            _logger.LogError(exception, exception.Message);

            string identifier = package.Target == DefaulTarget
            ? $"{package.DisplayName} v{package.Version}"
            : $"{package.DisplayName} v{package.Version} for {package.Target}";

            return Conflict($"{identifier} already exists");
        }

        MoveUploadedFile(fileOnServer);
        return Created($"/{package.Identifier}", package);

        static bool IsExtensionAllowed(string fileName)
        {
            string permittedExtension = ".vsix";
            string fileExtension = Path.GetExtension(fileName).ToLower();
            return !string.IsNullOrWhiteSpace(fileExtension) && permittedExtension == fileExtension;
        }
    }

    [HttpGet]
    [Route("download/{identifier}/{version?}")]
    public IActionResult DownloadPackage(string identifier, string version)
    {
        var package = _databaseService.Find(p => p.Identifier == identifier && p.Version == version).FirstOrDefault();
        if (package == null)
            return NotFound();

        string outputDirectory = Utilities.OutputDirectory(_environment);
        string fileName = $"{package.Location}.vsix";
        string fileOnServer = Path.Combine(outputDirectory, fileName);
        if (!System.IO.File.Exists(fileOnServer))
            return NotFound();

        return PhysicalFile(fileOnServer, "application/octet-stream", fileName);
    }

    [HttpGet("RequireUploadAPIKey")]
    public IActionResult GetUploadUIState()
    {
        return Ok(new { RequireUploadAPIKey = RequireUploadAPIKey });
    }

    bool RequireUploadAPIKey
    {
        get
        {
            var apiKey = _config.GetValue<string>(APIKey);
            return !string.IsNullOrWhiteSpace(apiKey);
        }
    }

    string UploadAPIKey => _config.GetValue<string>(APIKey)!;

    void CleanUploadsOnError(string fileOnServer)
    {
        System.IO.File.Delete(fileOnServer);

        string uploadDirectory = Utilities.OutputDirectory(_environment);
        string folder = Path.GetFileNameWithoutExtension(fileOnServer);
        string outputFolder = Path.Combine(uploadDirectory, folder);

        System.IO.Directory.Delete(outputFolder, true);
    }

    void MoveUploadedFile(string fileOnServer)
    {
        string uploadDirectory = Utilities.OutputDirectory(_environment);
        string fileName = Path.GetFileName(fileOnServer);
        System.IO.File.Move(fileOnServer, Path.Combine(uploadDirectory, fileName), true);
    }

    IEnumerable<ExtensionPackage> GetPreReleasePackages(bool prerelease)
    {
        var packagesList = prerelease ? _databaseService.Query()
        : _databaseService.Find(p => !p.IsPreRelease);

        var extensionPackages = packagesList.GroupBy(p => new { p.Identifier, p.Version })
        .Select(x =>
            new ExtensionPackage(x.Key.Identifier, x.Key.Version,
                x.Where(r => r.Identifier == x.Key.Identifier).ToList()
            )).OrderByDescending(r => GetVersion(r.Version));

        return extensionPackages;
    }

    SemVersion GetVersion(string version)
    {
        var ver = SemVersion.Parse("0.0.0", SemVersionStyles.Any);
        if (string.IsNullOrWhiteSpace(version))
            return ver;

        SemVersion.TryParse(version, SemVersionStyles.Any, out ver);
        return ver;
    }

    public ExtensionController(
        [NotNull] IDatabaseService databaseService,
        IWebHostEnvironment environment,
        IPackageReader manifestReader,
        ILogger<ExtensionController> logger,
        IConfiguration config)
    {
        _databaseService = databaseService;
        _environment = environment;
        _manifestReader = manifestReader;
        _logger = logger;
        _config = config;
    }
    readonly IDatabaseService _databaseService;
    readonly IPackageReader _manifestReader;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<ExtensionController> _logger;
    private readonly IConfiguration _config;

    const string DefaulTarget = "any";
    const string APIKey = "ApiKey";
}
