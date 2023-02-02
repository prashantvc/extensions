
using System.Diagnostics;

public class ExtensionService {

	public async Task<Extension> GetExtension ([NotNull] string extensionName)
	{
		string extensionPath
			= $"./output/{extensionName}/extension";

		string packageFile = Path.Combine (extensionPath, "package.json");
		Debug.WriteLine ($"Package Path: {packageFile}");

		var data = await File.ReadAllTextAsync (packageFile);

		return Extension.FromJson (data);
	}

	public static ExtensionService Instance => _instance ??= new ExtensionService ();

	private ExtensionService () { }
	static ExtensionService? _instance;

}


