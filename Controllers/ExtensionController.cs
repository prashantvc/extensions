using Microsoft.AspNetCore.Mvc;
using Semver;

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

        if (string.IsNullOrWhiteSpace(filePath))
            return BadRequest("Extension file path is empty");

        string uploadLocation = Path.Combine("./uploads", filePath);
        if (!System.IO.Directory.Exists(uploadLocation))
        {
            System.IO.Directory.CreateDirectory("./uploads");
        }
        using (var fileStream = new FileStream(uploadLocation, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        string destination = Path.Combine("./output", filePath);

        ZipService.Instance.ExtractPackage(uploadLocation);
        System.IO.File.Move(uploadLocation, destination, true);

        //Make it singleton
        string fileName = Path.GetFileNameWithoutExtension(filePath);
        var ext = await _extensionService.GetExtensionAsync(fileName);

        bool success = ValidateVersion(ext);
        if (!success)
        {
            return BadRequest($"Version validation failed!");
        }

        _databaseService.Extensions.Insert(ext);

        System.Console.WriteLine($"Extension name: {ext.DisplayName}");

        return Created($"/{ext.Identifier}", ext);
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
}
