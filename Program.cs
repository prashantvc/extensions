
var app = new CommandApp ();
app.Configure (config => {
	config.AddCommand<AddExtensionFileCommand> ("add")
	.WithDescription ("Add extension package to the repository");
});

return await app.RunAsync (args);
