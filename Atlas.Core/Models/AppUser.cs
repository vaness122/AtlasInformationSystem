using Atlas.Core.Enum;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Atlas.Core.Models
{
   public class AppUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int PhoneNumber { get; set; }
       
        public UserRole Role { get; set; }
        public int? MunicipalityId { get; set; }
        public int? BarangayId { get; set; }
        public int?ZoneId { get; set; }

        public DateTime? LastLoginDate { get; set; }
        public int LoginCount { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public Municipality Municipality { get; set; } 
        public Barangay Barangay { get; set; }
        public Zone Zone { get; set; }  
       
    }
}
