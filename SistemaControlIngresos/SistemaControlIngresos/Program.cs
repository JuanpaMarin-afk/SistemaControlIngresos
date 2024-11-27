using Microsoft.EntityFrameworkCore;
using SistemaControlIngresos.Data;
using SistemaControlIngresos.Data.Db_Context_Reports;
using SistemaControlIngresos.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AttendantDbContext>(
    o => o.UseMySql(builder.Configuration.GetConnectionString("SqlServer"),
            new MySqlServerVersion(new Version(8, 0, 21))));
builder.Services.AddDbContext<TypeClientCbContext>(
    o => o.UseMySql(builder.Configuration.GetConnectionString("SqlServer"),
            new MySqlServerVersion(new Version(8, 0, 21))));
builder.Services.AddDbContext<ClientDbContext>(
    o => o.UseMySql(builder.Configuration.GetConnectionString("SqlServer"),
            new MySqlServerVersion(new Version(8, 0, 21))));
builder.Services.AddDbContext<UserDbContext>(
    o => o.UseMySql(builder.Configuration.GetConnectionString("SqlServer"),
            new MySqlServerVersion(new Version(8, 0, 21))));
builder.Services.AddDbContext<LogDbContext>(
    o => o.UseMySql(builder.Configuration.GetConnectionString("SqlServer"),
            new MySqlServerVersion(new Version(8, 0, 21))));
builder.Services.AddDbContext<IncomeDistributionDbContext>(
    o => o.UseMySql(builder.Configuration.GetConnectionString("SqlServer"),
            new MySqlServerVersion(new Version(8, 0, 21))));
builder.Services.AddDbContext<TypeWorkDbContext>(
    o => o.UseMySql(builder.Configuration.GetConnectionString("SqlServer"),
            new MySqlServerVersion(new Version(8, 0, 21))));
builder.Services.AddDbContext<ProjectDbContext>(
    o => o.UseMySql(builder.Configuration.GetConnectionString("SqlServer"),
            new MySqlServerVersion(new Version(8, 0, 21))));
builder.Services.AddDbContext<EarningDbContext>(
    o => o.UseMySql(builder.Configuration.GetConnectionString("SqlServer"),
            new MySqlServerVersion(new Version(8, 0, 21))));
builder.Services.AddDbContext<ReportsDbContext>(
    o => o.UseMySql(builder.Configuration.GetConnectionString("SqlServer"),
            new MySqlServerVersion(new Version(8, 0, 21))));


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowSpecificOrigin");

app.UseAuthorization();

app.MapControllers();

app.Run();
