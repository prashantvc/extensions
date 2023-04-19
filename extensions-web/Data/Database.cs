using System.Linq.Expressions;
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

        Packages.EnsureIndex("extensionid", p => new { p.Identifier, p.Version, p.Target }, true);
        var pkg = Packages.Insert(package);

        return pkg;
    }

    bool ValidateVersion(ExtensionManifest package)
    {
        bool success = SemVersion.TryParse(package.Version, SemVersionStyles.Strict, out var version);
        package.IsPreRelease = version.IsPrerelease;
        return success;
    }

    public List<ExtensionManifest> Find(Expression<Func<ExtensionManifest, bool>> predicate)
    {
        return Packages.Find(predicate).ToList();
    }

    public List<ExtensionManifest> Query()
    {
        return Packages.Query().ToList();
    }

    public ILiteCollection<ExtensionManifest> Packages =>
        _database.GetCollection<ExtensionManifest>("packages");

    public DatabaseService(ILiteDbContext liteDbContext)
    {
        _database = liteDbContext.Database;

    }

    readonly LiteDatabase _database;
}