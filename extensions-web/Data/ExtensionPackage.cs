class ExtensionPackage
{
    public ExtensionPackage(string identifier, IList<ExtensionManifest> extensions)
    {
        Identifier = identifier;
        Extensions = extensions;
    }
    public string Identifier { get; private set; }
    public IList<ExtensionManifest> Extensions { get; private set; }
}