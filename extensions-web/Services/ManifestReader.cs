using System.IO.Compression;

public interface IPackageReader
{
    void ExtractFile(string fileOnServer, string extractFileName = "extension.vsixmanifest");
}

public class PackageReader : IPackageReader
{
    public void ExtractFile(string fileOnServer, string extractFileName)
    {
        string outputDirectory = CreateOrGetOutputDirectory();
        string fileName = Path.GetFileNameWithoutExtension(fileOnServer);
        string manifestFilePath = Path.Combine(outputDirectory, fileName, extractFileName);

        CreateDirectory(manifestFilePath);

        using (var archive = ZipFile.OpenRead(fileOnServer))
        {
            var manifestEntry = archive.GetEntry(extractFileName);
            if (manifestEntry != null)
            {
                manifestEntry.ExtractToFile(manifestFilePath);
            }
        }

        void CreateDirectory(string manifestFilePath)
        {
            if (!Directory.Exists(Path.GetDirectoryName(manifestFilePath)))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(manifestFilePath));
            }
        }
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

    public PackageReader(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    private readonly IWebHostEnvironment _environment;
}