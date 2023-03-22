using LiteDB;

public interface IDatabaseService
{
    public ILiteCollection<PackageManifest> Packages { get; }
    BsonValue InsertPackage(PackageManifest package);
}