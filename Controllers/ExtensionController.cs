using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Semver;

[Route("api/[controller]")]
[ApiController]
public class ExtensionController : ControllerBase
{
    [HttpGet()]
    public IActionResult GetExtensions()
    {
        var exts = _databaseService.Extensions
                    .Query()
                    .ToList();

        if (exts.Count <= 0)
        {
            return NoContent();
        }

        return Ok(exts);
    }

    [HttpPost, DisableRequestSizeLimit]
    public async Task<IActionResult> AddExtensionsAsync(IFormFile file)
    {
        string filePath = file.FileName;

        if (string.IsNullOrWhiteSpace(filePath))
            return BadRequest("Extension file path is empty");

        string uploadLocation = Path.Combine("./uploads", filePath);
        using (var fileStream = new FileStream(uploadLocation, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        string destination = Path.Combine("./output", filePath);

        ZipService.Instance.ExtractPackage(uploadLocation);
        System.IO.File.Move(uploadLocation, destination, true);

        //Make it singleton
        string fileName = Path.GetFileNameWithoutExtension(filePath);
        var ext = await ExtensionService.Instance.GetExtension(fileName);

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

    public ExtensionController([NotNull] IDatabaseService databaseService)
    {
        _databaseService = databaseService;
    }
    readonly IDatabaseService _databaseService;
}
