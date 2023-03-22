using LiteDB;

public interface IDatabaseService
{
    public ILiteCollection<Extension> Extensions { get; }
    public ILiteCollection<PackageManifest> Packages { get; }
}