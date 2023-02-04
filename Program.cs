public static class Program
{
    public static async Task<int> Main(string[] args)
    {
        // Run app as web app
        if (args.Length > 1 && args[0] == "run")
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            // Add services to the container.
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var webApp = builder.Build();

            // Configure the HTTP request pipeline.
            if (webApp.Environment.IsDevelopment())
            {
                webApp.UseSwagger();
                webApp.UseSwaggerUI();
            }
            webApp.UseHttpsRedirection();
            webApp.UseAuthorization();
            webApp.MapControllers();

            await webApp.RunAsync();
            return 0;
        }

        var app = new CommandApp();
        app.Configure(config =>
        {
            config.AddCommand<AddExtensionFileCommand>("add")
                .WithDescription("Add extension package to the repository");
            config.AddCommand<ListExtensionsCommand>("list");
        });
        return await app.RunAsync(args);
    }
}