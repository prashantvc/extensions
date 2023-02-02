using LiteDB;

public class DatabaseService
{
    public void InsertExtension(Extension extension)
    {
        Extensions.Insert(extension);
    }

    public ILiteCollection<Extension> Extensions =>
        database.GetCollection<Extension>("extensions");
    public static DatabaseService Instance => _instance ??= new DatabaseService();
    private DatabaseService()
    {
        database = new LiteDatabase("Extensions.db");

    }
    static DatabaseService? _instance;
    readonly LiteDatabase database;
}