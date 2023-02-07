using Semver;
internal sealed class AddExtensionFileCommand : AsyncCommand<AddExtensionFileCommand.Settings>

{
    public sealed class Settings : CommandSettings
    {
        [Description("Extension package (VSIX) file path")]
        [CommandArgument(0, "[packagePath]")]
        public string? Path { get; init; }
    }

    public override async Task<int> ExecuteAsync([NotNull] CommandContext context, [NotNull] Settings settings)
    {
        string filePath = settings.Path ?? string.Empty;

        if (string.IsNullOrWhiteSpace(filePath))
            throw new NullReferenceException("Extension file path is empty");

        string destination = Path.Combine("output", Path.GetFileName(filePath));
        File.Copy(filePath, destination, true);

        string fileName = Path.GetFileNameWithoutExtension(filePath);
        ZipService.Instance.ExtractPackage(filePath);
        var ext = await ExtensionService.Instance.GetExtension(fileName);

        bool success = ValidateVersion(ext);
        if (!success)
        {
            AnsiConsole.MarkupLine($"Version validation failed!");
            return -99;
        }

        DatabaseService.Instance.InsertExtension(ext);

        AnsiConsole.MarkupLine($"Extension name: [green]{ext.DisplayName} [/]");
        return 0;
    }

    bool ValidateVersion(Extension ext)
    {
        bool success = SemVersion.TryParse(ext.Version, SemVersionStyles.Strict, out var version);
        ext.IsPreRelease = version.IsPrerelease;
        return success;
    }
}