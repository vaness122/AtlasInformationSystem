using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.Shared.DTOs
{
   public class UpdateResidentDto
    {
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string? MiddleName { get; set; }
        public DateTime Birthdate { get; set; }
        public string Gender { get; set; }
        public string CivilStatus { get; set; }
        public string Occupation { get; set; }
        public string? Email { get; set; }
        public string Address { get; set; }
        public int ZoneId { get; set; }
        public int HouseholdId { get; set; }
        public bool IsHead { get; set; }
        public bool IsActive { get; set; }
    }
}
