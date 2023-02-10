using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorPages();
builder.Services.AddControllers();

// Add services to the container.
builder.Services.Configure<LiteDbOptions>(builder.Configuration.GetSection("LiteDbOptions"));
builder.Services.Configure<FormOptions>(p =>
{
    p.ValueLengthLimit = int.MaxValue;
    p.MultipartBodyLengthLimit = int.MaxValue;
    p.MemoryBufferThreshold = int.MaxValue;
});

builder.Services.AddSingleton<IExtensionService, ExtensionService>();
builder.Services.AddSingleton<ILiteDbContext, LiteDbContext>();
builder.Services.AddTransient<IDatabaseService, DatabaseService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseAuthorization();
app.UseRouting();

app.MapRazorPages();
app.Run();