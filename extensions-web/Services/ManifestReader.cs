using System.IO.Compression;
using System.Xml.Serialization;

public interface IPackageReader
{
    string ExtractFile(string fileOnServer, string extractFileName);
    void ExtractPackage(string fileOnServer);
}

public class PackageReader : IPackageReader
{
    public void ExtractPackage(string fileOnServer)
    {
        string outputFilePath = ExtractFile(fileOnServer, "extension.vsixmanifest");

        var serializer = new XmlSerializer(typeof(PackageManifest));
        using (var stream = new StringReader(File.ReadAllText(outputFilePath)))
        {
            var packageManifest = (PackageManifest)serializer.Deserialize(stream);
            var assets = packageManifest.Assets;

            foreach (var asset in assets)
            {
                try
                {
                    ExtractFile(fileOnServer, asset.Path);
                }
                catch (NullReferenceException)
                {
                    continue;
                }
            }
        }
    }
    public string ExtractFile(string fileOnServer, string extractFileName)
    {
        string outputDirectory = CreateOrGetOutputDirectory();
        string fileName = Path.GetFileNameWithoutExtension(fileOnServer);

        string extractFilePath = Path.Combine(outputDirectory, fileName, extractFileName);

        CreateDirectory(extractFilePath);

        using (var archive = ZipFile.OpenRead(fileOnServer))
        {
            var manifestEntry = archive.GetEntry(extractFileName);
            if (manifestEntry != null)
            {
                manifestEntry.ExtractToFile(extractFilePath);
            }
        }

        return extractFilePath;
    }

    void CreateDirectory(string path)
    {
        if (!Directory.Exists(Path.GetDirectoryName(path)))
            Directory.CreateDirectory(Path.GetDirectoryName(path));
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