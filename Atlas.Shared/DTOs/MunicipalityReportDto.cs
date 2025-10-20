using System;
using System.Collections.Generic;

namespace Atlas.Shared.DTOs
{
    public class MunicipalityReportDto
    {
        public DateTime GeneratedAt { get; set; }
        public MunicipalityStatisticsDto MunicipalityStatistics { get; set; } = new MunicipalityStatisticsDto();
        public HouseholdStatisticsDto HouseholdStatistics { get; set; } = new HouseholdStatisticsDto();
        public ResidentStatisticsDto ResidentStatistics { get; set; } = new ResidentStatisticsDto();
        public string Summary { get; set; } = string.Empty;
    }

    public class MunicipalityStatisticsDto
    {
        public int MunicipalityId { get; set; }
        public int TotalBarangays { get; set; }
        public int TotalZones { get; set; }
        public int TotalHouseholds { get; set; }
        public int TotalResidents { get; set; }
        public double AverageHouseholdSize { get; set; }
        public double PopulationDensity { get; set; }
        public IEnumerable<BarangayStatisticsDto> BarangayStatistics { get; set; } = new List<BarangayStatisticsDto>();
    }

    public class HouseholdStatisticsDto
    {
        public int TotalHouseholds { get; set; }
        public double AverageHouseholdSize { get; set; }
        public List<BarangayHouseholdStatistic> HouseholdsByBarangay { get; set; } = new List<BarangayHouseholdStatistic>();
        public Dictionary<string, int> HouseholdDistribution { get; set; } = new Dictionary<string, int>();
    }

    public class ResidentStatisticsDto
    {
        public int TotalResidents { get; set; }
        public int ActiveResidents { get; set; }
        public int HouseholdHeads { get; set; }
        public double AverageAge { get; set; }
        public Dictionary<string, int> GenderDistribution { get; set; } = new Dictionary<string, int>();
        public Dictionary<string, int> AgeDistribution { get; set; } = new Dictionary<string, int>();
        public List<BarangayResidentStatistic> ResidentsByBarangay { get; set; } = new List<BarangayResidentStatistic>();
    }

   
    public class ZoneStatisticsDto
    {
        public int ZoneId { get; set; }
        public string ZoneName { get; set; } = string.Empty;
        public string BarangayName { get; set; } = string.Empty;
        public int TotalHouseholds { get; set; }
        public int TotalResidents { get; set; }
        public double AverageHouseholdSize { get; set; }
        public int ActiveResidents { get; set; }
        public int HouseholdHeads { get; set; }
        public Dictionary<string, int> GenderDistribution { get; set; } = new Dictionary<string, int>();
    }

    public class ZoneStatisticDto
    {
        public int ZoneId { get; set; }
        public string ZoneName { get; set; } = string.Empty;
        public int HouseholdCount { get; set; }
        public int ResidentCount { get; set; }
    }

    public class BarangayHouseholdStatistic
    {
        public int BarangayId { get; set; }
        public string BarangayName { get; set; } = string.Empty;
        public int HouseholdCount { get; set; }
    }

    public class BarangayResidentStatistic
    {
        public int BarangayId { get; set; }
        public string BarangayName { get; set; } = string.Empty;
        public int ResidentCount { get; set; }
    }
}