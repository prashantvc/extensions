using System.IO.Compression;
using System.Xml.Serialization;

public interface IPackageReader
{
    string ExtractFile(string fileOnServer, string extractFileName);
    PackageManifest ExtractPackage(string fileOnServer);

    public string CreateOrGetOutputDirectory();
}

public class PackageReader : IPackageReader
{
    public PackageManifest ExtractPackage(string fileOnServer)
    {
        string outputFilePath = ExtractFile(fileOnServer, "extension.vsixmanifest");
        PackageManifest? packageManifest = default(PackageManifest);

        var serializer = new XmlSerializer(typeof(PackageManifest));
        using (StringReader stream = new StringReader(File.ReadAllText(outputFilePath)))
        {
            packageManifest = serializer.Deserialize(stream) as PackageManifest;
            var assets = packageManifest?.Assets;

            foreach (var asset in assets)
            {
                if (asset.Path != null)
                    ExtractFile(fileOnServer, asset.Path);
            }
        }

        return packageManifest;
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
        string? directoryName = Path.GetDirectoryName(path);
        if (!string.IsNullOrEmpty(directoryName) && !Directory.Exists(directoryName))
            Directory.CreateDirectory(directoryName);
    }

    public string CreateOrGetOutputDirectory()
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