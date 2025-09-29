using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.Shared.Responses
{
    public class AuthResponse
    {
        public bool isAuthenticated { get; set; }
        public string Token { get; set; }
        public string ErrorMessage { get; set; }
        public DateTime? TokenExpiration { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
        public string UserId { get; set; }
        public int BarangayId { get; set; }
        public int MunicipalityId { get; set; }
        public static AuthResponse Success(string token, DateTime expiration, string userName,
            string role, string userId , int barangayId , int municipalityId)
        {

            return new AuthResponse
            {
                isAuthenticated = true,
                Token = token,
                TokenExpiration = expiration,
                UserName = userName,
                Role = role,
                UserId = userId,
                BarangayId = barangayId,
                MunicipalityId = municipalityId


            };



        }

        public static AuthResponse Fail(string errorMessage)
        {
            return new AuthResponse
            {
                isAuthenticated = false,
                ErrorMessage = errorMessage
            };
        }
    }
}
