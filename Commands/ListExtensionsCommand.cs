internal sealed class ListExtensionsCommand : Command<ListExtensionsCommand.Settings>
{
    public override int Execute([NotNull] CommandContext context, [NotNull] Settings settings)
    {
        var exts = DatabaseService.Instance.Extensions.Query().ToList();

        if (exts.Count <= 0)
        {
            AnsiConsole.MarkupLine("No results found!");
            return -99;
        }

        var table = new Table();
        table.AddColumn("Identifier");
        table.AddColumn("Display Name");
        table.AddColumn("Version");

        exts.ForEach(p => table.AddRow(p.Identifier, p.DisplayName, p.Version));
        AnsiConsole.Write(table);

        return 0;
    }

    public sealed class Settings : CommandSettings { }
}