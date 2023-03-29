class ExtensionPackage
{
    public ExtensionPackage(string identifier, string version, IList<ExtensionManifest> extensions)
    {
        Identifier = identifier;
        Extensions = extensions;
        Version = version;
    }
    public string Identifier { get; private set; }
    public string Version { get; private set; }
    public IList<ExtensionManifest> Extensions { get; private set; }
}