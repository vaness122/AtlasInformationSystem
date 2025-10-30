using Atlas.Core.Models;
using Atlas.Shared.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.BAL.Services
{
    public class ZoneService : IZoneService
    {
        private readonly IZoneRepository _zoneRepository;

        public ZoneService(IZoneRepository zoneRepository)
        {
            _zoneRepository = zoneRepository;
        }
        public async Task<IEnumerable<ZoneDto>> GetAllZonesAsync()
        {
           var zones = await _zoneRepository.GetAllAsync();

            return zones.Select(z => new ZoneDto 
            {
                Id = z.Id,
            Name = z.Name,
            Description = z.Description,
            BarangayId = z.BarangayId,
            BarangayName = z.Barangay?.Name
            });

        }

        public async Task<IEnumerable<ZoneDto>> GetZonesByBarangayAsync(int barangayId)
        {
            var zones = await _zoneRepository.GetByBarangayIdAsync(barangayId);

            return zones.Select(z => new ZoneDto
            {
                Id =z.Id,
                Name = z.Name,
                BarangayId =z.BarangayId,
                BarangayName = z.Barangay?.Name

            });
           
        }
    }
}
