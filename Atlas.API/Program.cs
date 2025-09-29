using Atlas.BAL.Services;
using Atlas.Core.Enum;
using Atlas.Core.Models;
using Atlas.Core.Models.Residents;
using Atlas.DAL.Data;
using Atlas.DAL.DbContext;

using Atlas.DAL.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

//IdentityRole
builder.Services.AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

//authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("SuperAdmin", policy =>
    policy.RequireRole(UserRole.SuperAdmin.ToString()));

    options.AddPolicy("MunicipalityAdmin", policy =>
    policy.RequireRole(UserRole.MunicipalityAdmin.ToString()));



});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new
    TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JTW:ValidIssueer"],
            ValidAudience = builder.Configuration["JWT:ValidAudience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]
                ))


        };
    });


builder.Configuration.AddJsonFile("secret.json", optional: false, reloadOnChange: true);



builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//repos
builder.Services.AddTransient<IResidentRepository, ResidentRepository>();
builder.Services.AddTransient<IHouseholdRepository, HouseholdRepository>();
builder.Services.AddTransient<IBarangayRepository, BarangayRepository>();
builder.Services.AddTransient<IMunicipalityRepository, MunicipalityRepository>();
builder.Services.AddTransient<IZoneRepository, ZoneRepository>();

//services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddControllers();
var app = builder.Build();


using(var scope = app.Services.CreateScope())

{
    var services = scope.ServiceProvider;
        try
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        await IdentityDataInitializer.SeedRolesAsync(roleManager);
    }
    catch(Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An Error occured while seeding roles");
    }


}






// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
