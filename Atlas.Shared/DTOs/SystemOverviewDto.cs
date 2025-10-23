using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.Shared.DTOs
{
   public class SystemOverviewDto
    {

        public SystemStatisticsDto SystemStatistics { get; set; } = new SystemStatisticsDto();
        public IEnumerable<MunicipalityStatisticsDto> MunicipalityStatistics { get; set; } = new List<MunicipalityStatisticsDto>();
        public int ActiveAdmins { get; set; }
        public int InactiveAdmins { get; set; }
        public DateTime LastUpdated { get; set; }




     

    }


}
