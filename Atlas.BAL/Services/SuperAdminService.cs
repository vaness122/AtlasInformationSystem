using Atlas.BAL.Interfaces;
using Atlas.Core.Models;
using Atlas.Core.Models.Residents;
using Atlas.DAL.Repositories;
using Atlas.Shared.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SystemStatisticsDto = Atlas.Shared.DTOs.SystemStatisticsDto;

namespace Atlas.BAL.Services
{
    public class SuperAdminService : ISuperAdmin
    {
        private readonly Interfaces.ISuperAdminRepository _superAdminRepository;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly ILogger<SuperAdminService> _logger;

        public SuperAdminService(
            Interfaces.ISuperAdminRepository superAdminRepository,
            UserManager<AppUser> userManager,
            IMapper mapper,
            ILogger<SuperAdminService> logger
            
            
            )
        {
            _superAdminRepository = superAdminRepository;
            _userManager = userManager;
            _mapper = mapper;
            _logger = logger;

        }

        public async Task<BarangayDto> CreateBarangayAsync(CreateBarangayDto barangayDto)
        {
            try
            {
                var barangay = _mapper.Map<Barangay>(barangayDto);
                var createdBarangay = await _superAdminRepository.CreateBarangayAsync(barangay);
                return _mapper.Map<BarangayDto>(createdBarangay);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating barangay");
                throw;
            }
        }

        public async Task<HouseholdDto> CreateHouseholdAsync(CreateHouseholdDto householdDto)
        {
            try
            {
                var household = _mapper.Map<Household>(householdDto);
                var createdHousehold = await _superAdminRepository.CreateHouseholdAsync(household);
                return _mapper.Map<HouseholdDto>(createdHousehold);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating household");
                throw;
            }
        }

        public async Task<MunicipalityDto> CreateMunicipalityAsync(MunicipalityDto municipalityDto)
        {
            try
            {
                var municipality = _mapper.Map<Municipality>(municipalityDto);
                var createdMunicipality = await _superAdminRepository.CreateMunicipalityAsync(municipality);
                return _mapper.Map<MunicipalityDto>(createdMunicipality);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating municipality");
                throw;
            }
        }

        public async Task<ResidentDto> CreateResidentAsync(CreateResidentDto residentDto)
        {
            try
            {
                var resident = _mapper.Map<Resident>(residentDto);
                var createdResident = await _superAdminRepository.CreateResidentAsync(resident);
                return _mapper.Map<ResidentDto>(createdResident);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating resident");
                throw;
            }
        }

        public async Task<ZoneDto> CreateZoneAsync(CreateZoneDto zoneDto)
        {
            try
            {
                var zone = _mapper.Map<Zone>(zoneDto);
                var createdZone = await _superAdminRepository.CreateZoneAsync(zone);
                return _mapper.Map<ZoneDto>(createdZone);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating zone");
                throw;
            }
        }

        public async Task<bool> DeactivateAdminAsync(string id)
        {
            try
            {
                return await _superAdminRepository.DeactivateAdminAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deactivating admin {AdminId}", id);
                throw;
            }
        }

        public async Task<bool> DeleteBarangayAsync(int id)
        {
            try
            {
                return await _superAdminRepository.DeleteBarangayAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting barangay {BarangayId}", id);
                throw;
            }
        }

        public async Task<bool> DeleteHouseholdAsync(int id)
        {
            try
            {
                return await _superAdminRepository.DeleteHouseholdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting household {HouseholdId}", id);
                throw;
            }
        }

        public async Task<bool> DeleteMunicipalityAsync(int id)
        {
            try
            {
                return await _superAdminRepository.DeleteMunicipalityAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting municipality {MunicipalityId}", id);
                throw;
            }
        }

        public async Task<bool> DeleteResidentAsync(int id)
        {
            try
            {
                return await _superAdminRepository.DeleteResidentAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting resident {ResidentId}", id);
                throw;
            }
        }

        public async Task<bool> DeleteZoneAsync(int id)
        {
            try
            {
                return await _superAdminRepository.DeleteZoneAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting zone {ZoneId}", id);
                throw;
            }
        }

        public async Task<IEnumerable<UserDto>> GetAllAdminsAsync()
        {
            try
            {
                var admins = await _superAdminRepository.GetAllAdminsAsync();
                return _mapper.Map<IEnumerable<UserDto>>(admins);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all admins");
                throw;
            }
        }

        public async Task<IEnumerable<BarangayDto>> GetAllBarangaysAsync()
        {
            try
            {
                var barangays = await _superAdminRepository.GetAllBarangaysAsync();
                return _mapper.Map<IEnumerable<BarangayDto>>(barangays);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all barangays");
                throw;
            }
        }

        public async Task<IEnumerable<HouseholdDto>> GetAllHouseholdsAsync()
        {
            try
            {
                var households = await _superAdminRepository.GetAllHouseholdsAsync();
                return _mapper.Map<IEnumerable<HouseholdDto>>(households);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all households");
                throw;
            }
        }

        public async Task<IEnumerable<MunicipalityDto>> GetAllMunicipalitiesAsync()
        {
            try
            {
                var municipalities = await _superAdminRepository.GetAllMunicipalitiesAsync();
                return _mapper.Map<IEnumerable<MunicipalityDto>>(municipalities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all municipalities");
                throw;
            }
        }

        public async Task<IEnumerable<ResidentDto>> GetAllResidentsAsync()
        {
            try
            {
                var residents = await _superAdminRepository.GetAllResidentsAsync();
                return _mapper.Map<IEnumerable<ResidentDto>>(residents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all residents");
                throw;
            }
        }

        public async Task<IEnumerable<ZoneDto>> GetAllZonesAsync()
        {
            try
            {
                var zones = await _superAdminRepository.GetAllZonesAsync();
                return _mapper.Map<IEnumerable<ZoneDto>>(zones);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all zones");
                throw;
            }
        }

        public async Task<BarangayDto> GetBarangayByIdAsync(int id)
        {
            try
            {
                var barangay = await _superAdminRepository.GetBarangayByIdAsync(id);
                return _mapper.Map<BarangayDto>(barangay);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting barangay {BarangayId}", id);
                throw;
            }
        }

        public async Task<HouseholdDto> GetHouseholdByIdAsync(int id)
        {
            try
            {
                var household = await _superAdminRepository.GetHouseholdByIdAsync(id);
                return _mapper.Map<HouseholdDto>(household);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting household {HouseholdId}", id);
                throw;
            }
        }

        public async Task<MunicipalityDto> GetMunicipalityByIdAsync(int id)
        {
            try
            {
                var municipality = await _superAdminRepository.GetMunicipalityByIdAsync(id);
                return _mapper.Map<MunicipalityDto>(municipality);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting municipality {MunicipalityId}", id);
                throw;
            }
        }

        public async Task<IEnumerable<MunicipalityStatisticsDto>> GetMunicipalityStatisticsAsync()
        {
            try
            {
                var statistics = await _superAdminRepository.GetMunicipalityStatisticsAsync();
                return _mapper.Map<IEnumerable<MunicipalityStatisticsDto>>(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting municipality statistics");
                throw;
            }
        }

        public async Task<ResidentDto> GetResidentByIdAsync(int id)
        {
           try
            {
                var resident = await _superAdminRepository.GetResidentByIdAsync(id);
                return _mapper.Map<ResidentDto>(resident);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting resident {Residen3tId}", id);
                throw;
            }
        }

        public async Task<SystemOverviewDto> GetSystemOverviewAsync()
        {
            try
            {
                _logger.LogInformation("Getting system overview");

                // Get all data in parallel for better performance
                var systemStatsTask = _superAdminRepository.GetSystemStatisticsAsync();
                var municipalityStatsTask = _superAdminRepository.GetMunicipalityStatisticsAsync();
                var adminsTask = GetAllAdminsAsync();

                await Task.WhenAll(systemStatsTask, municipalityStatsTask, adminsTask);

                var systemStats = await systemStatsTask;
                var municipalityStats = await municipalityStatsTask;
                var admins = await adminsTask;

                // Calculate admin counts properly - use IsActive property from UserDto
                var activeAdmins = admins.Count(a => a.IsActive);
                var inactiveAdmins = admins.Count(a => !a.IsActive);

                return new SystemOverviewDto
                {
                    SystemStatistics = systemStats, // Already mapped by repository
                    MunicipalityStatistics = municipalityStats, // Already mapped by repository
                    ActiveAdmins = activeAdmins,
                    InactiveAdmins = inactiveAdmins,
                    LastUpdated = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system overview");

                // Return safe defaults instead of throwing
                return new SystemOverviewDto
                {
                    SystemStatistics = new SystemStatisticsDto(),
                    MunicipalityStatistics = new List<MunicipalityStatisticsDto>(),
                    ActiveAdmins = 0,
                    InactiveAdmins = 0,
                    LastUpdated = DateTime.UtcNow
                };
            }
        }

        private bool IsAdminActive(UserDto a)
        {
            throw new NotImplementedException();
        }

        public async Task<SystemStatisticsDto> GetSystemStatisticsAsync()
        {
            try
            {
                var statistics = await _superAdminRepository.GetSystemStatisticsAsync();
                return _mapper.Map<SystemStatisticsDto>(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system statistics");
                throw;
            }
        }

        public async Task<ZoneDto> GetZoneByIdAsync(int id)
        {
            try
            {
                var zone = await _superAdminRepository.GetZoneByIdAsync(id);
                return _mapper.Map<ZoneDto>(zone);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting zone {ZoneId}", id);
                throw;
            }
        }

        public async Task<bool> ReactivateAdminAsync(string id)
        {
            try
            {
                return await _superAdminRepository.ReactivateAdminAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reactivating admin {AdminId}", id);
                throw;
            }
        }

        public async Task<BarangayDto> UpdateBarangayAsync(int id, UpdateBarangayDto barangayDto)
        {
            try
            {
                var existingBarangay = await _superAdminRepository.GetBarangayByIdAsync(id);
                if (existingBarangay == null)
                    return null;

                _mapper.Map(barangayDto, existingBarangay);
                var updatedBarangay = await _superAdminRepository.UpdateBarangayAsync(existingBarangay);
                return _mapper.Map<BarangayDto>(updatedBarangay);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating barangay {BarangayId}", id);
                throw;
            }
        }

        public async Task<HouseholdDto> UpdateHouseholdAsync(int id, UpdateHouseholdDto householdDto)
        {
            try
            {
                var existingHousehold = await _superAdminRepository.GetHouseholdByIdAsync(id);
                if (existingHousehold == null)
                    return null;

                _mapper.Map(householdDto, existingHousehold);
                var updatedHousehold = await _superAdminRepository.UpdateHouseholdAsync(existingHousehold);
                return _mapper.Map<HouseholdDto>(updatedHousehold);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating household {HouseholdId}", id);
                throw;
            }
        }

        public async Task<MunicipalityDto> UpdateMunicipalityAsync(int id, MunicipalityDto municipalityDto)
        {
            try
            {
                var existingMunicipality = await _superAdminRepository.GetMunicipalityByIdAsync(id);
                if (existingMunicipality == null)
                    return null;

                _mapper.Map(municipalityDto, existingMunicipality);
                var updatedMunicipality = await _superAdminRepository.UpdateMunicipalityAsync(existingMunicipality);
                return _mapper.Map<MunicipalityDto>(updatedMunicipality);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating municipality {MunicipalityId}", id);
                throw;
            }
        }

        public async Task<ResidentDto> UpdateResidentAsync(int id, UpdateResidentDto residentDto)
        {
            try
            {
                var existingResident = await _superAdminRepository.GetResidentByIdAsync(id);
                if (existingResident == null)
                    return null;

                _mapper.Map(residentDto, existingResident);
                var updatedResident = await _superAdminRepository.UpdateResidentAsync(existingResident);
                return _mapper.Map<ResidentDto>(updatedResident);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating resident {ResidentId}", id);
                throw;
            }
        }

        public async Task<ZoneDto> UpdateZoneAsync(int id, UpdateZoneDto zoneDto)
        {
            try
            {
                var existingZone = await _superAdminRepository.GetZoneByIdAsync(id);
                if (existingZone == null)
                    return null;

                _mapper.Map(zoneDto, existingZone);
                var updatedZone = await _superAdminRepository.UpdateZoneAsync(existingZone);
                return _mapper.Map<ZoneDto>(updatedZone);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating zone {ZoneId}", id);
                throw;
            }
        }
    }
}
