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

        _manifestReader.ExtractPackage(fileOnServer);

        return Ok();

        static bool IsExtensionAllowed(string fileName)
        {
            string permittedExtension = ".vsix";
            string fileExtension = Path.GetExtension(fileName).ToLower();
            return !string.IsNullOrWhiteSpace(fileExtension) && permittedExtension == fileExtension;
        }
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

    string CreateOrGetOutputDirectory()
    {
        string outputDirectory = "output";
        outputDirectory = Path.Combine(_environment.ContentRootPath, "ClientApp/public", outputDirectory);
        if (!Directory.Exists(outputDirectory))
        {
            Directory.CreateDirectory(outputDirectory);
        }

        return outputDirectory;
    }

    bool ValidateVersion(Extension ext)
    {
        bool success = SemVersion.TryParse(ext.Version, SemVersionStyles.Strict, out var version);
        ext.IsPreRelease = version.IsPrerelease;
        return success;
    }

    public void ExtractFiles(string archiveFilePath, string destinationFolderPath, params string[] files)
    {
        foreach (var file in files)
        {
            using (var fileStream = new FileStream(archiveFilePath, FileMode.Open, FileAccess.Read))
            using (var zipFile = new ZipFile(fileStream))
            {
                // Find the package.json entry in the archive
                var packageJsonEntry = zipFile.GetEntry($"extension/{file}");
                if (packageJsonEntry == null)
                {
                    continue;
                }

                // Extract the package.json entry to the destination folder
                string destinationFolder = Path.GetFileNameWithoutExtension(archiveFilePath);
                var destinationFilePath = Path.Combine(destinationFolderPath, destinationFolder, Path.GetFileName(file));
                var directoryName = Path.GetDirectoryName(destinationFilePath);
                if (!string.IsNullOrEmpty(directoryName) && !Directory.Exists(directoryName))
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
    }


    public ExtensionController(
        [NotNull] IDatabaseService databaseService,
        [NotNull] IExtensionService extensionService,
        [NotNull] ILogger<ExtensionController> logger,
        IWebHostEnvironment environment,
        IPackageReader manifestReader)
    {
        _databaseService = databaseService;
        _extensionService = extensionService;
        _logger = logger;
        _environment = environment;
        _manifestReader = manifestReader;
    }
    readonly IDatabaseService _databaseService;
    readonly IExtensionService _extensionService;
    readonly IPackageReader _manifestReader;

    private readonly ILogger<ExtensionController> _logger;
    private readonly IWebHostEnvironment _environment;
}
