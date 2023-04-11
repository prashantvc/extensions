using System.IO.Compression;
using System.Xml.Serialization;

public interface IPackageReader
{
    string ExtractFile(string fileOnServer, string extractFileName);
    ExtensionManifest ExtractPackage(string fileOnServer);
}

public class PackageReader : IPackageReader
{
    public ExtensionManifest ExtractPackage(string fileOnServer)
    {
        string outputFilePath = ExtractFile(fileOnServer, "extension.vsixmanifest");
        ExtensionManifest? manifest = default(ExtensionManifest);

        var serializer = new XmlSerializer(typeof(ExtensionManifest));
        using (StringReader stream = new StringReader(File.ReadAllText(outputFilePath)))
        {
            manifest = serializer.Deserialize(stream) as ExtensionManifest;
            var assets = manifest?.Assets;

            foreach (var asset in assets)
            {
                if (asset.Path != null)
                    ExtractFile(fileOnServer, asset.Path);
            }
        }
        //set file name
        manifest.Location = Path.GetFileNameWithoutExtension(fileOnServer);
        return manifest;
    }
    public string ExtractFile(string fileOnServer, string extractFileName)
    {
        string outputDirectory = Utilities.OutputDirectory(_environment);
        string fileName = Path.GetFileNameWithoutExtension(fileOnServer);

        string extractFilePath = Path.Combine(outputDirectory, fileName, extractFileName);

        Utilities.CreateDirectory(extractFilePath);

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

    public PackageReader(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    private readonly IWebHostEnvironment _environment;
}