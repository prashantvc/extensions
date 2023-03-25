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

        if (packagesList.Count <= 0)
            return NoContent();

        return Ok(packagesList);
    }

    [HttpGet]
    [Route("{id}/{version?}")]
    public IActionResult GetExtension(string id, string version = "", bool prerelease = false)
    {
        var packages = _databaseService.Packages
           .Find(p => p.Identifier == id)
           .OrderByDescending(p => p.Version);

        return Ok(packages);
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

    List<PackageManifest> GetPreReleasePackages(bool prerelease)
    {
        var packagesList = prerelease ? _databaseService.Packages.Query().ToList()
        : _databaseService.Packages.Find(p => !p.IsPreRelease).ToList();

        var mylist = packagesList.GroupBy(p => p.Identifier).Select(x =>
             x.Where(r => r.Identifier == x.Key)
                .OrderByDescending(r => r.Version)
                .FirstOrDefault()
        ).ToList();

        return mylist;
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

    public ExtensionController(
        [NotNull] IDatabaseService databaseService,
        [NotNull] ILogger<ExtensionController> logger,
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
