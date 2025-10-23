using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.DAL.Repositories
{
    public class SystemStatisticsDto
    {
        public int TotalMunicipalities { get; set; }
        public int TotalBarangays { get; set; }
        public int TotalZones { get; internal set; }
        public int TotalHouseholds { get; internal set; }
        public int TotalResidents { get; internal set; }
        public int TotalAdmins { get; internal set; }
        public int ActiveAdmins { get; internal set; }
        public int InactiveAdmins { get; internal set; }
        public Dictionary<string, int> AdminsByRole { get; internal set; }
        public double AverageHouseholdSize { get; internal set; }
    }
}
