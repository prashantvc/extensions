using LiteDB;

public interface IDatabaseService
{
    public ILiteCollection<ExtensionManifest> Packages { get; }
    BsonValue InsertPackage(ExtensionManifest package);
}