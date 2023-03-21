
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;

public class ExtensionService : IExtensionService
{
    public async Task<Extension> GetExtensionAsync([NotNull] string extensionName)
    {
        string extensionPath
            = $"{_environment.ContentRootPath}/output/{extensionName}";

        string packageFile = Path.Combine(extensionPath, "package.json");
        Debug.WriteLine($"Package Path: {packageFile}");

        var data = await File.ReadAllTextAsync(packageFile);
        try
        {
            var ext =  Extension.FromJson(data);
            return ext;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
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