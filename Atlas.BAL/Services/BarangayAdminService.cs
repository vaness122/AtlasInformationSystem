using Atlas.Core.Models;
using Atlas.Core.Models.Residents;
using Atlas.DAL.Repositories;
using Atlas.Shared.DTOs;
using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Atlas.BAL.Services
{
    public class BarangayAdminService : IBarangayAdminService
    {
        private readonly IZoneRepository _zoneRepository;
        private readonly IHouseholdRepository _householdRepository;
        private readonly IResidentRepository _residentRepository;
        private readonly IBarangayRepository _barangayRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<BarangayAdminService> _logger;

        public BarangayAdminService(
            IZoneRepository zoneRepository,
            IHouseholdRepository householdRepository,
            IResidentRepository residentRepository,
            IBarangayRepository barangayRepository,
            IMapper mapper,
            ILogger<BarangayAdminService> logger)
        {
            _zoneRepository = zoneRepository;
            _householdRepository = householdRepository;
            _residentRepository = residentRepository;
            _barangayRepository = barangayRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<ZoneDto>> GetZonesByBarangayAsync(int barangayId)
        {
            try
            {
                var zones = await _zoneRepository.GetByBarangayIdAsync(barangayId);
                return _mapper.Map<IEnumerable<ZoneDto>>(zones);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting zones for barangay {BarangayId}", barangayId);
                throw;
            }
        }

        public async Task<ZoneDto> GetZoneByIdAsync(int zoneId, int barangayId)
        {
            try
            {
                var zone = await _zoneRepository.GetByIdAsync(zoneId);
                if (zone == null || zone.BarangayId != barangayId)
                    return null;

                return _mapper.Map<ZoneDto>(zone);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting zone {ZoneId} for barangay {BarangayId}", zoneId, barangayId);
                throw;
            }
        }

        public async Task<ZoneDto> CreateZoneAsync(CreateZoneDto zoneDto)
        {
            try
            {
                var zone = _mapper.Map<Zone>(zoneDto);
                await _zoneRepository.AddAsync(zone);
                return _mapper.Map<ZoneDto>(zone);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating zone for barangay {BarangayId}", zoneDto.BarangayId);
                throw;
            }
        }

        public async Task<ZoneDto> UpdateZoneAsync(int id, UpdateZoneDto zoneDto, int barangayId)
        {
            try
            {
                var existingZone = await _zoneRepository.GetByIdAsync(id);
                if (existingZone == null || existingZone.BarangayId != barangayId)
                    return null;

                _mapper.Map(zoneDto, existingZone);
                await _zoneRepository.UpdateAsync(existingZone);
                return _mapper.Map<ZoneDto>(existingZone);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating zone {ZoneId} for barangay {BarangayId}", id, barangayId);
                throw;
            }
        }

        public async Task<bool> DeleteZoneAsync(int id, int barangayId)
        {
            try
            {
                var zone = await _zoneRepository.GetByIdAsync(id);
                if (zone == null || zone.BarangayId != barangayId)
                    return false;

                var households = await _householdRepository.GetByZoneIdAsync(id);
                if (households.Any())
                    throw new InvalidOperationException("Cannot delete zone that has households");

                await _zoneRepository.DeleteAsync(id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting zone {ZoneId} for barangay {BarangayId}", id, barangayId);
                throw;
            }
        }

        public async Task<IEnumerable<HouseholdDto>> GetHouseholdsByBarangayAsync(int barangayId)
        {
            try
            {
                var zones = await _zoneRepository.GetByBarangayIdAsync(barangayId);
                var allHouseholds = new List<Household>();

                foreach (var zone in zones)
                {
                    var zoneHouseholds = await _householdRepository.GetByZoneIdAsync(zone.Id);
                    allHouseholds.AddRange(zoneHouseholds);
                }

                return _mapper.Map<IEnumerable<HouseholdDto>>(allHouseholds);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting households for barangay {BarangayId}", barangayId);
                throw;
            }
        }

        public async Task<HouseholdDto> GetHouseholdByIdAsync(int householdId, int barangayId)
        {
            try
            {
                var household = await _householdRepository.GetByIdAsync(householdId);
                if (household == null) return null;

                var zone = await _zoneRepository.GetByIdAsync(household.ZoneId);
                if (zone?.BarangayId != barangayId) return null;

                return _mapper.Map<HouseholdDto>(household);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting household {HouseholdId} for barangay {BarangayId}", householdId, barangayId);
                throw;
            }
        }

        public async Task<HouseholdDto> CreateHouseholdAsync(CreateHouseholdDto householdDto)
        {
            try
            {
                var zone = await _zoneRepository.GetByIdAsync(householdDto.ZoneId);
                if (zone?.BarangayId != householdDto.BarangayId)
                    throw new UnauthorizedAccessException("Zone does not belong to your barangay");

                var household = _mapper.Map<Household>(householdDto);
                await _householdRepository.AddAsync(household);
                return _mapper.Map<HouseholdDto>(household);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating household for barangay {BarangayId}", householdDto.BarangayId);
                throw;
            }
        }

        public async Task<HouseholdDto> UpdateHouseholdAsync(int id, UpdateHouseholdDto householdDto, int barangayId)
        {
            try
            {
                var existingHousehold = await _householdRepository.GetByIdAsync(id);
                if (existingHousehold == null) return null;

                var zone = await _zoneRepository.GetByIdAsync(existingHousehold.ZoneId);
                if (zone?.BarangayId != barangayId) return null;

                _mapper.Map(householdDto, existingHousehold);
                await _householdRepository.UpdateAsync(existingHousehold);
                return _mapper.Map<HouseholdDto>(existingHousehold);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating household {HouseholdId} for barangay {BarangayId}", id, barangayId);
                throw;
            }
        }

        public async Task<bool> DeleteHouseholdAsync(int id, int barangayId)
        {
            try
            {
                var household = await _householdRepository.GetByIdAsync(id);
                if (household == null) return false;

                var zone = await _zoneRepository.GetByIdAsync(household.ZoneId);
                if (zone?.BarangayId != barangayId) return false;

                var residents = await _residentRepository.GetResidentsByHouseHoldIdAsync(id);
                if (residents.Any())
                    throw new InvalidOperationException("Cannot delete household that has residents");

                await _householdRepository.DeleteAsync(id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting household {HouseholdId} for barangay {BarangayId}", id, barangayId);
                throw;
            }
        }

        public async Task<IEnumerable<HouseholdDto>> GetHouseholdsByZoneAsync(int zoneId, int barangayId)
        {
            try
            {
                var zone = await _zoneRepository.GetByIdAsync(zoneId);
                if (zone?.BarangayId != barangayId)
                    throw new UnauthorizedAccessException("Zone does not belong to your barangay");

                var households = await _householdRepository.GetByZoneIdAsync(zoneId);
                return _mapper.Map<IEnumerable<HouseholdDto>>(households);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting households for zone {ZoneId} in barangay {BarangayId}", zoneId, barangayId);
                throw;
            }
        }

        public async Task<IEnumerable<ResidentDto>> GetResidentsByBarangayAsync(int barangayId)
        {
            try
            {
                var households = await GetHouseholdsByBarangayAsync(barangayId);
                var allResidents = new List<Resident>();

                foreach (var household in households)
                {
                    var householdResidents = await _residentRepository.GetResidentsByHouseHoldIdAsync(household.Id);
                    allResidents.AddRange(householdResidents);
                }

                return _mapper.Map<IEnumerable<ResidentDto>>(allResidents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting residents for barangay {BarangayId}", barangayId);
                throw;
            }
        }

        public async Task<ResidentDto> GetResidentByIdAsync(int residentId, int barangayId)
        {
            try
            {
                var resident = await _residentRepository.GetByIdAsync(residentId);
                if (resident == null) return null;

                var household = await _householdRepository.GetByIdAsync(resident.HousholdId);
                if (household == null) return null;

                var zone = await _zoneRepository.GetByIdAsync(household.ZoneId);
                if (zone?.BarangayId != barangayId) return null;

                return _mapper.Map<ResidentDto>(resident);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting resident {ResidentId} for barangay {BarangayId}", residentId, barangayId);
                throw;
            }
        }

        public async Task<ResidentDto> CreateResidentAsync(CreateResidentDto residentDto)
        {
            try
            {
                var household = await _householdRepository.GetByIdAsync(residentDto.HouseholdId);
                if (household == null)
                    throw new ArgumentException("Household not found");

                var zone = await _zoneRepository.GetByIdAsync(household.ZoneId);
                if (zone?.BarangayId != residentDto.BarangayId)
                    throw new UnauthorizedAccessException("Household does not belong to your barangay");

                var resident = _mapper.Map<Resident>(residentDto);
                await _residentRepository.AddAsync(resident);
                return _mapper.Map<ResidentDto>(resident);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating resident for barangay {BarangayId}", residentDto.BarangayId);
                throw;
            }
        }

        public async Task<ResidentDto> UpdateResidentAsync(int id, UpdateResidentDto residentDto, int barangayId)
        {
            try
            {
                var existingResident = await _residentRepository.GetByIdAsync(id);
                if (existingResident == null) return null;

                var household = await _householdRepository.GetByIdAsync(existingResident.HousholdId);
                if (household == null) return null;

                var zone = await _zoneRepository.GetByIdAsync(household.ZoneId);
                if (zone?.BarangayId != barangayId) return null;

                _mapper.Map(residentDto, existingResident);
                await _residentRepository.UpdateAsync(existingResident);
                return _mapper.Map<ResidentDto>(existingResident);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating resident {ResidentId} for barangay {BarangayId}", id, barangayId);
                throw;
            }
        }

        public async Task<bool> DeleteResidentAsync(int id, int barangayId)
        {
            try
            {
                var resident = await _residentRepository.GetByIdAsync(id);
                if (resident == null) return false;

                var household = await _householdRepository.GetByIdAsync(resident.HousholdId);
                if (household == null) return false;

                var zone = await _zoneRepository.GetByIdAsync(household.ZoneId);
                if (zone?.BarangayId != barangayId) return false;

                await _residentRepository.DeleteAsync(id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting resident {ResidentId} for barangay {BarangayId}", id, barangayId);
                throw;
            }
        }

        public async Task<IEnumerable<ResidentDto>> GetResidentsByHouseholdAsync(int householdId, int barangayId)
        {
            try
            {
                var household = await _householdRepository.GetByIdAsync(householdId);
                if (household == null)
                    throw new ArgumentException("Household not found");

                var zone = await _zoneRepository.GetByIdAsync(household.ZoneId);
                if (zone?.BarangayId != barangayId)
                    throw new UnauthorizedAccessException("Household does not belong to your barangay");

                var residents = await _residentRepository.GetResidentsByHouseHoldIdAsync(householdId);
                return _mapper.Map<IEnumerable<ResidentDto>>(residents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting residents for household {HouseholdId} in barangay {BarangayId}", householdId, barangayId);
                throw;
            }
        }

        public async Task<BarangayStatisticsDto> GetBarangayStatisticsAsync(int barangayId)
        {
            try
            {
                var zones = await GetZonesByBarangayAsync(barangayId);
                var households = await GetHouseholdsByBarangayAsync(barangayId);
                var residents = await GetResidentsByBarangayAsync(barangayId);

                return new BarangayStatisticsDto
                {
                    BarangayId = barangayId,
                    TotalZones = zones.Count(),
                    TotalHouseholds = households.Count(),
                    TotalResidents = residents.Count(),
                    AverageHouseholdSize = households.Any() ? Math.Round(residents.Count() / (double)households.Count(), 2) : 0,
                    ActiveResidents = residents.Count(r => r.IsActive),
                    HouseholdHeads = residents.Count(r => r.IsHead),
                    ZoneStatistics = zones.Select(z => new ZoneStatisticDto
                    {
                        ZoneId = z.Id,
                        ZoneName = z.Name,
                        HouseholdCount = households.Count(h => h.ZoneId == z.Id),
                        ResidentCount = residents.Count(r => r.ZoneId == z.Id)
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting statistics for barangay {BarangayId}", barangayId);
                throw;
            }
        }

        public async Task<ZoneStatisticsDto> GetZoneStatisticsAsync(int zoneId, int barangayId)
        {
            try
            {
                var zone = await _zoneRepository.GetByIdAsync(zoneId);
                if (zone?.BarangayId != barangayId)
                    throw new UnauthorizedAccessException("Zone does not belong to your barangay");

                var households = await GetHouseholdsByZoneAsync(zoneId, barangayId);
                var residents = new List<ResidentDto>();

                foreach (var household in households)
                {
                    var householdResidents = await _residentRepository.GetResidentsByHouseHoldIdAsync(household.Id);
                    residents.AddRange(_mapper.Map<IEnumerable<ResidentDto>>(householdResidents));
                }

                return new ZoneStatisticsDto
                {
                    ZoneId = zoneId,
                    ZoneName = zone.Name,
                    TotalHouseholds = households.Count(),
                    TotalResidents = residents.Count,
                    AverageHouseholdSize = households.Any() ? Math.Round(residents.Count / (double)households.Count(), 2) : 0,
                    ActiveResidents = residents.Count(r => r.IsActive),
                    HouseholdHeads = residents.Count(r => r.IsHead)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting statistics for zone {ZoneId} in barangay {BarangayId}", zoneId, barangayId);
                throw;
            }
        }
    }
}