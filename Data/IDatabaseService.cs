using LiteDB;

public interface IDatabaseService
{
    public ILiteCollection<Extension> Extensions { get; }
}