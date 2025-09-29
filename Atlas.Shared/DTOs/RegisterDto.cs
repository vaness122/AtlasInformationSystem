using Atlas.Core.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.Shared.DTOs
{
   public class RegisterDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
  
        public string Email { get; set; }
        public string Password { get; set; }
        public UserRole Role { get; set; }
        
        public int? MunicipalityId { get; set; }
        public int? BarangayId { get; set; }
        public int?ZoneId { get; set; }

    }
}
