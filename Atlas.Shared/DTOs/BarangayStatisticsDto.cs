using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.Shared.DTOs
{
    public class BarangayStatisticsDto
    {
        public int BarangayId { get; set; }
        public string BarangayName { get; set; } = string.Empty;
        public int TotalZones { get; set; }
        public int TotalHouseholds { get; set; }
        public int TotalResidents { get; set; }
        public double AverageHouseholdSize { get; set; }
        public int ActiveResidents { get; set; }
        public int HouseholdHeads { get; set; }
        public List<ZoneStatisticDto> ZoneStatistics { get; set; } = new();
    }
}