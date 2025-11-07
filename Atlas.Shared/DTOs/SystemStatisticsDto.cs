using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.Shared.DTOs
{
    public class SystemStatisticsDto
    {

        public int TotalMunicipalities { get; set; }
        public int TotalBarangays { get; set; }
        public int TotalZones { get; set; }
        public int TotalHouseholds { get; set; }
        public int TotalResidents { get; set; }
        public int TotalAdmins { get; set; }
        public int ActiveAdmins { get; set; }
        public int InactiveAdmins { get; set; }
        public Dictionary<string, int> AdminsByRole { get; set; } = new();
        public double AverageHouseholdSize { get; set; }

        
    }
}
