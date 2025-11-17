
using Atlas.Core.Models;
using Atlas.Core.Models.Residents;
using Atlas.Shared.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Atlas.BAL.Interfaces // Changed from Atlas.DAL.Repositories
{
    public interface ISuperAdminRepository
    {
        Task<SystemOverviewDto> GetSystemOverviewAsync();
        Task<SystemStatisticsDto> GetSystemStatisticsAsync();
        Task<IEnumerable<MunicipalityStatisticsDto>> GetMunicipalityStatisticsAsync();

        Task<IEnumerable<UserDto>> GetAllAdminsAsync();
        Task<bool> DeactivateAdminAsync(string id);
        Task<bool> ReactivateAdminAsync(string id);

        Task<IEnumerable<Municipality>> GetAllMunicipalitiesAsync();
        Task<Municipality> GetMunicipalityByIdAsync(int id);
        Task<Municipality> CreateMunicipalityAsync(Municipality municipality);
        Task<Municipality> UpdateMunicipalityAsync(Municipality municipality);
        Task<bool> DeleteMunicipalityAsync(int id);

        Task<IEnumerable<Barangay>> GetAllBarangaysAsync();
        Task<Barangay> GetBarangayByIdAsync(int id);
        Task<Barangay> CreateBarangayAsync(Barangay barangay);
        Task<Barangay> UpdateBarangayAsync(Barangay barangay);
        Task<bool> DeleteBarangayAsync(int id);

        Task<IEnumerable<Zone>> GetAllZonesAsync();
        Task<Zone> GetZoneByIdAsync(int id);
        Task<Zone> CreateZoneAsync(Zone zone);
        Task<Zone> UpdateZoneAsync(Zone zone);
        Task<bool> DeleteZoneAsync(int id);

        Task<IEnumerable<Household>> GetAllHouseholdsAsync();
        Task<Household> GetHouseholdByIdAsync(int id);
        Task<Household> CreateHouseholdAsync(Household household);
        Task<Household> UpdateHouseholdAsync(Household household);
        Task<bool> DeleteHouseholdAsync(int id);

        Task<IEnumerable<Resident>> GetAllResidentsAsync();
        Task<Resident> GetResidentByIdAsync(int id);
        Task<Resident> CreateResidentAsync(Resident resident);
        Task<Resident> UpdateResidentAsync(Resident resident);
        Task<bool> DeleteResidentAsync(int id);
    }
}