public class Utilities
{
    public static string UploadDirectory(IWebHostEnvironment environment)
    {
        string uploadDirectory = "uploads";
        uploadDirectory = Path.Combine(environment.ContentRootPath, uploadDirectory);
        if (!Directory.Exists(uploadDirectory))
        {
            Directory.CreateDirectory(uploadDirectory);
        }

        return uploadDirectory;
    }

    public static void CreateDirectory(string path)
    {
        string? directoryName = Path.GetDirectoryName(path);
        if (!string.IsNullOrEmpty(directoryName) && !Directory.Exists(directoryName))
            Directory.CreateDirectory(directoryName);
    }

    public static string OutputDirectory(IWebHostEnvironment environment)
    {
        string outputDirectory = "output";
        outputDirectory = Path.Combine(environment.ContentRootPath, outputDirectory);
        if (!Directory.Exists(outputDirectory))
        {
            Directory.CreateDirectory(outputDirectory);
        }

        return outputDirectory;
    }
}