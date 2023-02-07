
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ILiteDbContext, LiteDbContext>();
builder.Services.AddControllers();
// Add services to the container.
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