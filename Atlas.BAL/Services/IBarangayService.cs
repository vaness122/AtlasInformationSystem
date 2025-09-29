using Atlas.Shared.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.BAL.Services
{
    public interface IBarangayService
    {
        Task<IEnumerable<ZoneDto>> GetAllZoneAsync();

    }
}
