using Atlas.BAL.Services;
using Atlas.Core.Enum;
using Atlas.Core.Models;
using Atlas.Shared.DTOs;
using Atlas.Shared.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;

namespace Atlas.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;
        private readonly UserManager<AppUser> _userManager;

        public AuthController(
            IAuthService authService,
            ILogger<AuthController> logger,
            UserManager<AppUser> userManagaer)
         
        {
            _authService = authService;
            _logger = logger;
            _userManager = userManagaer;
           
        }
       

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AuthResponse
                    {
                        isAuthenticated = false,
                        ErrorMessage = string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage))
                    });
                }

                // Validate admin role
                if (!IsValidAdminRole(registerDto.Role))
                {
                    return BadRequest(AuthResponse.Fail("Invalid role. Must be SuperAdmin, MunicipalityAdmin, or BarangayAdmin"));
                }

                // Validate required IDs based on role
                var validationError = ValidateRoleRequirements(registerDto);
                if (validationError != null)
                {
                    return BadRequest(validationError);
                }


                //proper null values based on role 


                if (registerDto.Role == UserRole.SuperAdmin)
                {
                    registerDto.MunicipalityId = null;
                    registerDto.BarangayId = null;
                    registerDto.ZoneId = null;
                }
                else if (registerDto.Role == UserRole.MunicipalityAdmin)
                {
                    registerDto.BarangayId = null;
                    registerDto.ZoneId = null;
                }















                var result = await _authService.RegisterAsync(registerDto);

                if (!result.isAuthenticated)
                {
                    return BadRequest(result);
                }

                _logger.LogInformation($"New admin registered: {registerDto.Email} with role {registerDto.Role}");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return StatusCode(500, AuthResponse.Fail("An error occurred during registration"));
            }
        }

        private bool IsValidAdminRole(UserRole role)
        {
            return role == UserRole.SuperAdmin ||
                   role == UserRole.MunicipalityAdmin ||
                   role == UserRole.BarangayAdmin;
        }

        private AuthResponse? ValidateRoleRequirements(RegisterDto dto)
        {
            switch (dto.Role)
            {
                case UserRole.BarangayAdmin:
                    if (!dto.MunicipalityId.HasValue)
                        return AuthResponse.Fail("MunicipalityId is required for BarangayAdmin");
                    if (!dto.BarangayId.HasValue)
                        return AuthResponse.Fail("BarangayId is required for BarangayAdmin");
                    break;

                case UserRole.MunicipalityAdmin:
                    if (!dto.MunicipalityId.HasValue)
                        return AuthResponse.Fail("MunicipalityId is required for MunicipalityAdmin");
                    if (dto.BarangayId.HasValue)
                        return AuthResponse.Fail("BarangayId should NOT be provided for MunicipalityAdmin");
                    break;

                case UserRole.SuperAdmin:
                    if (dto.MunicipalityId.HasValue || dto.BarangayId.HasValue)
                        return AuthResponse.Fail("SuperAdmin should not have MunicipalityId and BarangayId");
                    break;
            }
            return null;
        }

        //login

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AuthResponse
                    {
                        isAuthenticated = false,
                        ErrorMessage = string.Join(",",
                        ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage))
                    });
                }

                var result = await _authService.LoginAsync(loginDto);
                if (!result.isAuthenticated)
                {
                    _logger.LogWarning($"Failed login attempt for {loginDto.Email}");
                    return Unauthorized(result);

                }

                _logger.LogInformation($"Successful login for {loginDto.Email}");
                return Ok(result);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, AuthResponse.Fail("An error occured during login"));
            }
        }


        //getting the current user
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserAsync()
        {

          

            try
            {

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized("User ID claim is missing");

                var user = await _authService.GetUserById(userId);

                if (user == null)
                    return NotFound("User not found");

                var userInfo = new
                {
                    userId = user.Id,
                    Email = user.Email,
                    Role = user.Role.ToString(),
                    BarangayId = user.BarangayId,
                    MunicipalityId = user.MunicipalityId,
                    ZoneId = user.ZoneId,
                    FirstName = user.FirstName,
                    LastName = user.LastName
                };

                return Ok(userInfo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current user");
                return StatusCode(500, "An error occured while retrieving user information");



            }
        }

        [HttpGet("hello")]
        public IActionResult Hello()
        {
            return Ok("Helloworld");
        }




    }
}
