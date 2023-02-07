using Microsoft.Extensions.Options;
using LiteDB;

public interface ILiteDbContext
{
    LiteDatabase Database { get; }
}

public class LiteDbContext : ILiteDbContext
{
    public LiteDbContext(IOptions<LiteDbOptions> options)
    {
        Database = new LiteDatabase(options.Value.DatabaseLocation);
    }
    public LiteDatabase Database { get; }
}

public class LiteDbOptions
{
    public string DatabaseLocation { get; set; }
}