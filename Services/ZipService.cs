using System.Diagnostics.CodeAnalysis;
using ICSharpCode.SharpZipLib.Core;
using ICSharpCode.SharpZipLib.Zip;

internal class ZipService {

	public void ExtractPackage ([NotNull] string packagePath)
	{
		ZipFile? file = null;
		try {
			using var fs = File.OpenRead (packagePath);
			file = new ZipFile (fs);

			foreach (ZipEntry zipEntry in file) {
				if (!zipEntry.IsFile)
					continue;

				string entryFileName = zipEntry.Name;

				byte [] buffer = new byte [4096];
				Stream zipStream = file.GetInputStream (zipEntry);

				string extensionDirectory = Path.GetFileNameWithoutExtension (packagePath);
				string fullZipToPath = Path.Combine ("./output", extensionDirectory, entryFileName);
				string directoryName = Path.GetDirectoryName (fullZipToPath) ?? string.Empty;

				if (directoryName.Length > 0) {
					Directory.CreateDirectory (directoryName);
				}

				using var streamWriter = File.Create (fullZipToPath);
				StreamUtils.Copy (zipStream, streamWriter, buffer);
			}
		} finally {
			if (file != null) {
				file.IsStreamOwner = true; // Makes close also shut the underlying stream
				file.Close (); // Ensure we release resources
			}
		}
	}

	private ZipService ()
	{

	}

	public static ZipService Instance {
		get {
			return _instance ??= new ZipService ();
		}
	}

	static ZipService? _instance;
}