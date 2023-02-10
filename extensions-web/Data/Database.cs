using LiteDB;

public class DatabaseService : IDatabaseService
{
    public void InsertExtension(Extension extension)
    {
        Extensions.Insert(extension);
    }

    public ILiteCollection<Extension> Extensions =>
        _database.GetCollection<Extension>("extensions");
 
     public DatabaseService(ILiteDbContext liteDbContext)
    {
        _database = liteDbContext.Database;

    }
    
    readonly LiteDatabase _database;
}