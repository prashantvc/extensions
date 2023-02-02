internal sealed class ListExtensionsCommand : Command<ListExtensionsCommand.Settings>
{
    public override int Execute([NotNull] CommandContext context, [NotNull] Settings settings)
    {
        var exts = DatabaseService.Instance.Extensions.Query().ToList();
        exts.ForEach(p => System.Console.WriteLine(p.DisplayName));

        return 0;
    }

    public sealed class Settings : CommandSettings { }
}