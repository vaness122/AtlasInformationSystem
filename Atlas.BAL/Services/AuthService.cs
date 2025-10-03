using Atlas.Core.Models;
using Atlas.Shared.DTOs;
using Atlas.Shared.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.BAL.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            UserManager<AppUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ILogger<AuthService> logger
            )

        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _logger = logger;


        }

        public async Task<AuthResponse> LoginAsync(LoginDto loginDto)
        {
            try
            {
                //finding user by email
                var user = await _userManager.FindByEmailAsync(loginDto.Email);
                if (user == null)
                {
                    _logger.LogWarning($"Login failed - User not found: {loginDto.Email}");
                    return AuthResponse.Fail("Invalid credentials");
                }

                //checking password 
                if (!await _userManager.CheckPasswordAsync(user, loginDto.Password))
                {
                    _logger.LogWarning($"Login failed - invalid password fir user : {user.Email}");
                    return AuthResponse.Fail("Invalid credentials");
                }
                //generating jwt toen
                var token = await GenerateJwtToken(user);

                _logger.LogInformation($"Success login for user: {user.Email}");
                return AuthResponse.Success(
                     token: token,
                     expiration: DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("JWT:TokenValidityMinutes")),
                     userName: user.UserName,
                     email : user.Email,
                     role: user.Role.ToString(),
                     userId: user.Id,
                     barangayId: user.BarangayId ?? 0,  
                     municipalityId: user.MunicipalityId ?? 0,
                     zoneId : user.ZoneId ?? 0
                 );

            }
            catch (Exception ex) 
            
            {
                _logger.LogError(ex, "Error during login");
                return AuthResponse.Fail("An error occured during login");
            }


        }

        public async Task<AuthResponse> RegisterAsync(RegisterDto registerDto)
        {
            try
            {//see if email already exists , use logger, authresponse
                var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
                if (existingUser != null)
                {
                    _logger.LogWarning($"Registration failed - Email already exists: {registerDto.Email}");

                    return AuthResponse.Fail("Email already registered");
                }
                //creating a new user

                var user = new AppUser
                {
                    Email = registerDto.Email,
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Role = registerDto.Role,
                    UserName = registerDto.UserName,
                    MunicipalityId = registerDto.MunicipalityId,
                    BarangayId = registerDto.BarangayId,
                    ZoneId = registerDto.ZoneId
                    
                };

                //creating user with password
                var result = await _userManager.CreateAsync(user, registerDto.Password);
                if (!result.Succeeded)
                {
                    var errors = string.Join(",", result.Errors.Select(e => e.Description));
                    _logger.LogWarning($"User creation failed: {errors}");
                    return AuthResponse.Fail(errors);
                }

                //ensuring if role exists
                var roleName = registerDto.Role.ToString();
                if (!await _roleManager.RoleExistsAsync(roleName))
                {
                    await _roleManager.CreateAsync(new IdentityRole(roleName));
                    _logger.LogInformation($"Created new role : {roleName}");
                }

                //assigning role
                await _userManager.AddToRoleAsync(user, roleName);
                _logger.LogInformation($"Assingned role {roleName} to user {user.Email}");

                //generate jwt toke
                var token = await GenerateJwtToken(user);
                _logger.LogInformation($"Successfully registered user:{user.Email}");
                return AuthResponse.Success(
                    token: token,
                    expiration: DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>
                    ("JWT:TokenValidityMinutes")),
                    email : user.Email,
                   userName: user.UserName,
                   role: user.Role.ToString(),
                   userId: user.Id,
                   barangayId: user.BarangayId ?? 0,
                   municipalityId: user.MunicipalityId ?? 0,
                   zoneId: user.ZoneId ?? 0); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error during registration. StackTrace: {ex.StackTrace}");
                return AuthResponse.Fail($"An error occurred during registration: {ex.Message}");
            }
        }
        //
        private async Task<string> GenerateJwtToken(AppUser user)
        {
            var claims = new List<Claim>
           {
               new(ClaimTypes.NameIdentifier, user.Id),
               new(ClaimTypes.Email  , user.Email),
              
               new(ClaimTypes.Role , user.Role.ToString()),
               new(JwtRegisteredClaimNames.Jti , Guid.NewGuid().ToString())
           };

            //add location-based claims if available
            if (user.BarangayId.HasValue)
            {
                claims.Add(new Claim("BarangayId", user.BarangayId.Value.ToString()));
            }

            if (user.MunicipalityId.HasValue)
            {
                claims.Add(new Claim("MunicipalityId", user.MunicipalityId.Value.ToString()));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("JWT:TokenValidityMinutes")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


    }
    } 



