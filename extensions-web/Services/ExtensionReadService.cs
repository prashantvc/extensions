﻿
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;

public class ExtensionService : IExtensionService
{
    public async Task<Extension> GetExtensionAsync([NotNull] string extensionName)
    {
        string extensionPath
            = $"{_environment.ContentRootPath}/output/{extensionName}/extension";

        string packageFile = Path.Combine(extensionPath, "package.json");
        Debug.WriteLine($"Package Path: {packageFile}");

        var data = await File.ReadAllTextAsync(packageFile);

        return Extension.FromJson(data);
    }

    public ExtensionService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    private readonly IWebHostEnvironment _environment;
}

public interface IExtensionService
{
    public Task<Extension> GetExtensionAsync(string extensionName);
}