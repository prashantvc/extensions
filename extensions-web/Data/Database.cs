using LiteDB;
using Semver;

public class DatabaseService : IDatabaseService
{

    public BsonValue InsertPackage(ExtensionManifest package)
    {
        bool success = ValidateVersion(package);
        if (!success)
        {
            throw new InvalidOperationException("Version is not SemVer compliant.");
        }

        var pkg = Packages.Insert(package);
        Packages.EnsureIndex(p => p.Identifier);

        return pkg;
    }

    bool ValidateVersion(ExtensionManifest package)
    {
        bool success = SemVersion.TryParse(package.Version, SemVersionStyles.Strict, out var version);
        package.IsPreRelease = version.IsPrerelease;
        return success;
    }


    public ILiteCollection<ExtensionManifest> Packages =>
        _database.GetCollection<ExtensionManifest>("packages");

    public DatabaseService(ILiteDbContext liteDbContext)
    {
        _database = liteDbContext.Database;

    }

    readonly LiteDatabase _database;
}