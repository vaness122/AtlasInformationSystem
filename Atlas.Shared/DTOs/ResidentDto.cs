using Atlas.Core.Models.Residents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.Shared.DTOs
{ //barangay admin adding residents information
    public class ResidentDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string? MiddleName { get; set; }
        public string LastName { get; set; } = string.Empty;
        public DateTime Birthdate { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string CivilStatus { get; set; } = string.Empty;
        public string Occupation { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string Address { get; set; } = string.Empty;

        public int ZoneId { get; set; }
        public int MunicipalityId { get; set; }
        public int BarangayId { get; set; }
        public int HousholdId { get; set; }

        public bool IsHead { get; set; }
        public bool IsActive { get; set; }

        public string? MunicipalityName { get; set; }
        public string? BarangayName { get; set; }
        public string? ZoneName { get; set; }
        public string? HouseholdName { get; set; }

        public ResidentDto() { }

        public ResidentDto(Resident resident)
        {
            if (resident == null) throw new ArgumentNullException(nameof(resident));

            Id = resident.Id;
            FirstName = resident.FirstName;
            MiddleName = resident.MiddleName;
            LastName = resident.LastName;
            Birthdate = resident.Birthdate;
            Gender = resident.Gender;
            CivilStatus = resident.CivilStatus;
            Occupation = resident.Occupation;
            Email = resident.Email;
            Address = resident.Address;

            ZoneId = resident.ZoneId;
            MunicipalityId = resident.MunicipalityId;
            BarangayId = resident.BarangayId;
            HousholdId = resident.HouseholdId;

            IsHead = resident.IsHead;
            IsActive = resident.IsActive;

            MunicipalityName = resident.Municipality?.Name;
            BarangayName = resident.Barangay?.Name;
            ZoneName = resident.Zone?.Name;
            HouseholdName = resident.Household?.HouseHoldName;
        }

      
    }
}
