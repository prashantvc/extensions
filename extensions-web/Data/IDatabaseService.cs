using System.Linq.Expressions;
using LiteDB;

public interface IDatabaseService
{
    BsonValue InsertPackage(ExtensionManifest package);

    List<ExtensionManifest> Find(Expression<Func<ExtensionManifest, bool>> predicate);
    List<ExtensionManifest> Query();
}