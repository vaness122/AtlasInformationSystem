using Atlas.Core.Models;
using Atlas.Shared.DTOs;
using Atlas.Shared.Responses;
using Microsoft.AspNetCore.Authentication.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.BAL.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponse> LoginAsync(LoginDto loginDto);
        Task<AppUser> GetUserById(string userId);
    }
}
