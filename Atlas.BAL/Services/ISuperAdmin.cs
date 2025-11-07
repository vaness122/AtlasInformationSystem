using Atlas.DAL.Repositories;
using Atlas.Shared.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SystemStatisticsDto = Atlas.Shared.DTOs.SystemStatisticsDto;

namespace Atlas.BAL.Services
{
    public interface ISuperAdmin
    {
        Task<SystemOverviewDto> GetSystemOverviewAsync();
        Task<SystemStatisticsDto> GetSystemStatisticsAsync();
        Task<IEnumerable<MunicipalityStatisticsDto>> GetMunicipalityStatisticsAsync();



        Task<IEnumerable<UserDto>> GetAllAdminsAsync();
        Task<bool> DeactivateAdminAsync(string id);
        Task<bool> ReactivateAdminAsync(string id);


        Task<IEnumerable<MunicipalityDto>> GetAllMunicipalitiesAsync();
        Task<MunicipalityDto> GetMunicipalityByIdAsync(int id);
        Task<MunicipalityDto> CreateMunicipalityAsync(MunicipalityDto municipalityDto);
        Task<MunicipalityDto> UpdateMunicipalityAsync(int id, MunicipalityDto municipalityDto);
        Task<bool> DeleteMunicipalityAsync(int id);




        Task<IEnumerable<BarangayDto>> GetAllBarangaysAsync();
        Task<BarangayDto> GetBarangayByIdAsync(int id);
        Task<BarangayDto> CreateBarangayAsync(CreateBarangayDto barangayDto);
        Task<BarangayDto> UpdateBarangayAsync(int id, UpdateBarangayDto barangayDto);
        Task<bool> DeleteBarangayAsync(int id);


        Task<IEnumerable<ZoneDto>> GetAllZonesAsync();
        Task<ZoneDto> GetZoneByIdAsync(int id);
        Task<ZoneDto> CreateZoneAsync(CreateZoneDto zoneDto);
        Task<ZoneDto> UpdateZoneAsync(int id, UpdateZoneDto zoneDto);
        Task<bool> DeleteZoneAsync(int id);


        Task<IEnumerable<HouseholdDto>> GetAllHouseholdsAsync();
        Task<HouseholdDto> GetHouseholdByIdAsync(int id);
        Task<HouseholdDto> CreateHouseholdAsync(CreateHouseholdDto householdDto);
        Task<HouseholdDto> UpdateHouseholdAsync(int id, UpdateHouseholdDto householdDto);
        Task<bool> DeleteHouseholdAsync(int id);

        Task<IEnumerable<ResidentDto>> GetAllResidentsAsync();
        Task<ResidentDto> GetResidentByIdAsync(int id);
        Task<ResidentDto> CreateResidentAsync(CreateResidentDto residentDto);
        Task<ResidentDto> UpdateResidentAsync(int id, UpdateResidentDto residentDto);
        Task<bool> DeleteResidentAsync(int id);



    }
}
