using System;
using System.Collections.Generic;

namespace Atlas.Shared.DTOs
{
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new List<string>();
        public int? BarangayId { get; set; }
        public int? MunicipalityId { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public int LoginCount { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}