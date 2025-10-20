using Atlas.Shared.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Atlas.BAL.Services
{
    public interface IMunicipalityAdminService
    {
        Task<IEnumerable<BarangayDto>> GetBarangaysByMunicipalityAsync(int municipalityId);
        Task<BarangayDto> GetBarangayByIdAsync(int barangayId, int municipalityId);
        Task<BarangayDto> CreateBarangayAsync(CreateBarangayDto barangayDto);
        Task<BarangayDto> UpdateBarangayAsync(int id, UpdateBarangayDto barangayDto, int municipalityId);
        Task<bool> DeleteBarangayAsync(int id, int municipalityId);

        Task<IEnumerable<ZoneDto>> GetZonesByMunicipalityAsync(int municipalityId);
        Task<IEnumerable<ZoneStatisticsDto>> GetZonesStatisticsAsync(int municipalityId);

        Task<IEnumerable<HouseholdDto>> GetHouseholdsByMunicipalityAsync(int municipalityId);
        Task<HouseholdStatisticsDto> GetHouseholdStatisticsAsync(int municipalityId);

        Task<IEnumerable<ResidentDto>> GetResidentsByMunicipalityAsync(int municipalityId);
        Task<ResidentStatisticsDto> GetResidentStatisticsAsync(int municipalityId);

        Task<MunicipalityStatisticsDto> GetMunicipalityStatisticsAsync(int municipalityId);
        Task<IEnumerable<BarangayStatisticsDto>> GetBarangayStatisticsAsync(int municipalityId);
        Task<MunicipalityReportDto> GenerateMunicipalityReportAsync(int municipalityId);

        Task<IEnumerable<UserDto>> GetAdminsByMunicipalityAsync(int municipalityId);
    }
}