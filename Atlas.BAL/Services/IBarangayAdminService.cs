using Atlas.Shared.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.BAL.Services
{
   public interface IBarangayAdminService
    {
        Task<IEnumerable<ZoneDto>> GetZonesByBarangayAsync(int barangayId);
        Task<ZoneDto> GetZoneByIdAsync(int zoneId, int barangayId);
        Task<ZoneDto> CreateZoneAsync(CreateZoneDto zoneDto);
        Task<ZoneDto> UpdateZoneAsync(int id, UpdateZoneDto zoneDto, int barangayId);
        Task<bool> DeleteZoneAsync(int id, int barangayId);

        Task<IEnumerable<HouseholdDto>> GetHouseholdsByBarangayAsync(int barangayId);
        Task<HouseholdDto> GetHouseholdByIdAsync(int householdId, int barangayId);
        Task<HouseholdDto> CreateHouseholdAsync(CreateHouseholdDto householdDto);
        Task<HouseholdDto> UpdateHouseholdAsync(int id, UpdateHouseholdDto householdDto, int barangayId);
        Task<bool> DeleteHouseholdAsync(int id, int barangayId);
        Task<IEnumerable<HouseholdDto>> GetHouseholdsByZoneAsync(int zoneId, int barangayId);

        Task<IEnumerable<ResidentDto>> GetResidentsByBarangayAsync(int barangayId);
        Task<ResidentDto> GetResidentByIdAsync(int residentId, int barangayId);
        Task<ResidentDto> CreateResidentAsync(CreateResidentDto residentDto);
        Task<ResidentDto> UpdateResidentAsync(int id, UpdateResidentDto residentDto, int barangayId);
        Task<bool> DeleteResidentAsync(int id, int barangayId);
        Task<IEnumerable<ResidentDto>> GetResidentsByHouseholdAsync(int householdId, int barangayId);

        Task<BarangayStatisticsDto> GetBarangayStatisticsAsync(int barangayId);
        Task<ZoneStatisticsDto> GetZoneStatisticsAsync(int zoneId, int barangayId);
    }
}
