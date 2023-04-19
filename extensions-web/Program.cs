using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Cors;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<LiteDbOptions>(builder.Configuration.GetSection("LiteDbOptions"));
builder.Services.Configure<FormOptions>(p =>
{
    p.ValueLengthLimit = int.MaxValue;
    p.MultipartBodyLengthLimit = int.MaxValue;
    p.MemoryBufferThreshold = int.MaxValue;
});

builder.Services.AddSingleton<ILiteDbContext, LiteDbContext>();
builder.Services.AddSingleton<IPackageReader, PackageReader>();
builder.Services.AddTransient<IDatabaseService, DatabaseService>();

// Add services to the container.

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
    app.UseFileServer(new FileServerOptions { StaticFileOptions = { ServeUnknownFileTypes = true } });
}

app.UseCors(builder =>
    builder
    .AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod());


app.UseHttpsRedirection();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
