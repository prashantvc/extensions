internal sealed class ListExtensionsCommand : Command<ListExtensionsCommand.Settings>
{
    public override int Execute([NotNull] CommandContext context, [NotNull] Settings settings)
    {
        var exts = DatabaseService.Instance.Extensions
            .Query();

        if (exts.Count() <= 0)
        {
            AnsiConsole.MarkupLine("No results found!");
            return -99;
        }

        var table = new Table();
        table.AddColumn("Identifier");
        table.AddColumn("Display Name");
        table.AddColumn("Version");

        if (settings.ShowPrerelease)
        {
            table.AddColumn("Is Prerelease");
            exts.ToList()
                .ForEach(p => table.AddRow(p.Identifier, p.DisplayName, p.Version, p.IsPreRelease.ToString()));
        }
        else
        {
            exts.Where(p => !p.IsPreRelease)
                .ToList()
                .ForEach(p => table.AddRow(p.Identifier, p.DisplayName, p.Version));
        }

        AnsiConsole.Write(table);

        return 0;
    }

    public sealed class Settings : CommandSettings
    {
        [Description("Show pre-release versions in the list")]
        [CommandOption("--showPrerelease")]
        [DefaultValue(false)]
        public bool ShowPrerelease { get; set; }
    }
}