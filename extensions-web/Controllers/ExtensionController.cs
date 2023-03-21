using ICSharpCode.SharpZipLib.Core;
using ICSharpCode.SharpZipLib.Zip;
using Microsoft.AspNetCore.Mvc;
using Semver;
using System.Diagnostics.CodeAnalysis;

[Route("[controller]")]
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

        _logger.LogInformation($"Number of Extensions {extensionsList.Count}");

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

        string uploadDirectory = CreateOrGetUloadDirectory();

        string fileOnServer = Path.Combine(uploadDirectory, filePath);
        using (var fileStream = new FileStream(fileOnServer, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        string outputDirectory = CreateOrGetOutputDirectory();
        string destination = Path.Combine(outputDirectory, filePath);

        ExtractFiles(fileOnServer, outputDirectory);

        string fileName = Path.GetFileNameWithoutExtension(filePath);
        var ext = await _extensionService.GetExtensionAsync(fileName);

        _databaseService.Extensions.Insert(ext);

        System.IO.File.Move(fileOnServer, destination, true);

        bool success = ValidateVersion(ext);
        if (!success)
        {
            return BadRequest($"Version validation failed!");
        }

        return Created($"/{ext.Identifier}", ext);

        static bool IsExtensionAllowed(string fileName)
        {
            string permittedExtension = ".vsix";
            string fileExtension = Path.GetExtension(fileName).ToLower();
            return !string.IsNullOrWhiteSpace(fileExtension) && permittedExtension == fileExtension;
        }
    }

    string CreateOrGetUloadDirectory()
    {
        UploadDirectory = Path.Combine(_environment.ContentRootPath, UploadDirectory);
        if (!Directory.Exists(UploadDirectory))
        {
            Directory.CreateDirectory(UploadDirectory);
        }

        return UploadDirectory;
    }

    string CreateOrGetOutputDirectory()
    {
        OutputDirectory = Path.Combine(_environment.ContentRootPath, OutputDirectory);
        if (!Directory.Exists(OutputDirectory))
        {
            Directory.CreateDirectory(OutputDirectory);
        }

        return OutputDirectory;
    }

    bool ValidateVersion(Extension ext)
    {
        bool success = SemVersion.TryParse(ext.Version, SemVersionStyles.Strict, out var version);
        ext.IsPreRelease = version.IsPrerelease;
        return success;
    }


    public void ExtractFiles(string archiveFilePath, string destinationFolderPath)
    {
        using (var fileStream = new FileStream(archiveFilePath, FileMode.Open, FileAccess.Read))
        using (var zipFile = new ZipFile(fileStream))
        {
            // Find the package.json entry in the archive
            var packageJsonEntry = zipFile.GetEntry("extension/package.json");
            if (packageJsonEntry == null)
            {
                throw new FileNotFoundException("Could not find package.json in the archive.");
            }

            // Extract the package.json entry to the destination folder
            string destinationFolder = Path.GetFileNameWithoutExtension(archiveFilePath);
            var destinationFilePath = Path.Combine(destinationFolderPath, destinationFolder, "extension/package.json");
            var directoryName = Path.GetDirectoryName(destinationFilePath);
            if (!Directory.Exists(directoryName))
            {
                Directory.CreateDirectory(directoryName);
            }
            using (var outputStream = new FileStream(destinationFilePath, FileMode.Create))
            using (var zipStream = zipFile.GetInputStream(packageJsonEntry))
            {
                // Use SharpZipLib's CopyStream method to copy the contents of the package.json entry to the output stream
                // This will extract the file from the archive and save it to the destination folder
                byte[] buffer = new byte[4096];
                StreamUtils.Copy(zipStream, outputStream, buffer);
            }
        }
    }


    public ExtensionController(
        [NotNull] IDatabaseService databaseService,
        [NotNull] IExtensionService extensionService,
        [NotNull] ILogger<ExtensionController> logger,
        IWebHostEnvironment environment)
    {
        _databaseService = databaseService;
        _extensionService = extensionService;
        _logger = logger;
        _environment = environment;
    }
    readonly IDatabaseService _databaseService;
    readonly IExtensionService _extensionService;

    string UploadDirectory = "uploads";
    string OutputDirectory = "output";

    private readonly ILogger<ExtensionController> _logger;
    private readonly IWebHostEnvironment _environment;
}
