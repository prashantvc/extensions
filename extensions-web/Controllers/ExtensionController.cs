using Microsoft.AspNetCore.Mvc;
using Semver;
using System.Diagnostics.CodeAnalysis;

[Route("[controller]")]
[ApiController]
public class ExtensionController : ControllerBase
{
    [HttpGet("/extension")]
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
        string filePath = file.FileName;
        if (!IsExtensionAllowed(filePath))
            return BadRequest("Bad extension");

        string uploadDirectory = CreateOrGetUloadDirectory();

        string fileOnServer = Path.Combine(uploadDirectory, filePath);
        using (var fileStream = new FileStream(fileOnServer, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        var package = _manifestReader.ExtractPackage(fileOnServer);
        var result = _databaseService.InsertPackage(package);

        MoveUploadedFile(fileOnServer);

        return Created($"/{package.Identifier}", package);

        static bool IsExtensionAllowed(string fileName)
        {
            string permittedExtension = ".vsix";
            string fileExtension = Path.GetExtension(fileName).ToLower();
            return !string.IsNullOrWhiteSpace(fileExtension) && permittedExtension == fileExtension;
        }
    }

    void MoveUploadedFile(string fileOnServer)
    {
        string uploadDirectory = _manifestReader.CreateOrGetOutputDirectory();
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

    string CreateOrGetUloadDirectory()
    {
        string uploadDirectory = "uploads";
        uploadDirectory = Path.Combine(_environment.ContentRootPath, uploadDirectory);
        if (!Directory.Exists(uploadDirectory))
        {
            Directory.CreateDirectory(uploadDirectory);
        }

        return uploadDirectory;
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
        IPackageReader manifestReader)
    {
        _databaseService = databaseService;
        _environment = environment;
        _manifestReader = manifestReader;
    }
    readonly IDatabaseService _databaseService;
    readonly IPackageReader _manifestReader;
    private readonly IWebHostEnvironment _environment;
}
