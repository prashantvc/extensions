using Microsoft.AspNetCore.Mvc;
using Semver;
using System.Diagnostics.CodeAnalysis;

[Route("api/[controller]")]
[ApiController]
public class ExtensionController : ControllerBase
{
    [HttpGet()]
    public IActionResult GetExtensions(bool prerelease = false)
    {
        var extensions = _databaseService.Extensions;
        var extensionsList =
          prerelease ?
            extensions.Query().ToList() :
            extensions.Find(p => !p.IsPreRelease).ToList();

        if (extensionsList.Count <= 0)
            return NoContent();

        return Ok(extensionsList);
    }

    [HttpGet]
    [Route("{id}/{version?}")]
    public IActionResult GetExtension(string id, string version = "", bool prerelease = false)
    {
        string latestVersion = version;
        if (string.IsNullOrWhiteSpace(latestVersion))
        {
            SemVersion? ver = _databaseService.Extensions
                .Find(p => p.Identifier == id)
                .Select(p => SemVersion.Parse(p.Version, SemVersionStyles.Strict))
                .OrderDescending()
                .FirstOrDefault(p => p.IsPrerelease == prerelease);

            if (ver == null)
            {
                return NoContent();
            }

            latestVersion = ver.ToString();
        }
        var extension = _databaseService.Extensions
            .FindOne(p => p.Identifier == id && p.Version == latestVersion);
        return Ok(extension);
    }

    [HttpPost, DisableRequestSizeLimit]
    public async Task<IActionResult> AddExtensionsAsync(IFormFile file)
    {
        string filePath = file.FileName;

        if (!IsExtensionAllowed(filePath))
            return BadRequest("Bad extension");

        string uploadLocation = Path.Combine(UploadDirectory, filePath);
        if (!Directory.Exists(uploadLocation))
        {
            Directory.CreateDirectory(UploadDirectory);
        }
        using (var fileStream = new FileStream(uploadLocation, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        string destination = Path.Combine(OutputDirectory, filePath);

        ZipService.Instance.ExtractPackage(uploadLocation);
        System.IO.File.Move(uploadLocation, destination, true);


        string fileName = Path.GetFileNameWithoutExtension(filePath);
        var ext = await _extensionService.GetExtensionAsync(fileName);

        bool success = ValidateVersion(ext);
        if (!success)
            return BadRequest($"Version validation failed!");

        _databaseService.Extensions.Insert(ext);

        Console.WriteLine($"Extension name: {ext.DisplayName}");

        return Created($"/{ext.Identifier}", ext);

        static bool IsExtensionAllowed(string fileName)
        {
            string permittedExtension = ".vsix";
            string fileExtension = Path.GetExtension(fileName).ToLower();
            return !string.IsNullOrWhiteSpace(fileExtension) && permittedExtension == fileExtension;
        }
    }

    bool ValidateVersion(Extension ext)
    {
        bool success = SemVersion.TryParse(ext.Version, SemVersionStyles.Strict, out var version);
        ext.IsPreRelease = version.IsPrerelease;
        return success;
    }

    public ExtensionController([NotNull] IDatabaseService databaseService,
        [NotNull] IExtensionService extensionService)
    {
        _databaseService = databaseService;
        _extensionService = extensionService;
    }
    readonly IDatabaseService _databaseService;
    readonly IExtensionService _extensionService;

    const string UploadDirectory = "./uploads";
    const string OutputDirectory = "./output";
}
