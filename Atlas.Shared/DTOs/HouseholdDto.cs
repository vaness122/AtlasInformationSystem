using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.Shared.DTOs
{
    public class HouseholdDto
    {
        public int Id { get; set; }
        public string HouseHoldName { get; set; } = string.Empty;
        public int ZoneId { get; set; }
        public string? ZoneName { get; set; }
        public int ResidentCount { get; set; }
    }

    public class CreateHouseholdDto
    {
        public string HouseHoldName { get; set; } = string.Empty;
        public int ZoneId { get; set; }
        public int BarangayId { get; set; } // For validation
    }

    public class UpdateHouseholdDto
    {
        public string HouseHoldName { get; set; } = string.Empty;
    }
}
