using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.Core.Models.Residents
{
   public class Resident
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? MiddleName { get; set; }
        public DateTime Birthdate { get; set; }
        public string Gender { get; set; }
        public string CivilStatus { get; set; }
        public string Occupation { get; set; }
        public string? Email { get; set; }
        public string Address { get; set; }
        public int ZoneId { get; set; } //foreign key of zone class
        public int MunicipalityId { get; set; }
        public int BarangayId { get; set; }

        public Municipality Municipality { get; set; }
        public Barangay Barangay { get; set; }
        public Zone Zone { get; set; }

        public int HouseholdId {  get; set; }
        public Household Household { get; set; }
        public bool IsHead { get; set; }// to identify the head of house
        public bool IsActive { get; set; }
    }
}
