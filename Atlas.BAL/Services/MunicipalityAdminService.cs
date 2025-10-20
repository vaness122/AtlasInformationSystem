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
    public class MunicipalityAdminService : IMunicipalityAdminService
    {
        private readonly IBarangayRepository _barangayRepository;
        private readonly IZoneRepository _zoneRepository;
        private readonly IHouseholdRepository _householdRepository;
        private readonly IResidentRepository _residentRepository;
        private readonly IMunicipalityRepository _municipalityRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<MunicipalityAdminService> _logger;

        public MunicipalityAdminService(
            IBarangayRepository barangayRepository,
            IZoneRepository zoneRepository,
            IHouseholdRepository householdRepository,
            IResidentRepository residentRepository,
            IMunicipalityRepository municipalityRepository,
            IMapper mapper,
            ILogger<MunicipalityAdminService> logger)
        {
            _barangayRepository = barangayRepository;
            _zoneRepository = zoneRepository;
            _householdRepository = householdRepository;
            _residentRepository = residentRepository;
            _municipalityRepository = municipalityRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<BarangayDto>> GetBarangaysByMunicipalityAsync(int municipalityId)
        {
            try
            {
                var barangays = await _barangayRepository.GetByMunicipalityIdAsync(municipalityId);
                return _mapper.Map<IEnumerable<BarangayDto>>(barangays);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting barangays for municipality {MunicipalityId}", municipalityId);
                throw;
            }
        }

        public async Task<BarangayDto> GetBarangayByIdAsync(int barangayId, int municipalityId)
        {
            try
            {
                var barangay = await _barangayRepository.GetByIdAsync(barangayId);
                if (barangay == null || barangay.MunicipalityId != municipalityId)
                    return null;

                return _mapper.Map<BarangayDto>(barangay);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting barangay {BarangayId} for municipality {MunicipalityId}", barangayId, municipalityId);
                throw;
            }
        }

        public async Task<BarangayDto> CreateBarangayAsync(CreateBarangayDto barangayDto)
        {
            try
            {
                var barangay = _mapper.Map<Barangay>(barangayDto);
                await _barangayRepository.AddAsync(barangay);
                return _mapper.Map<BarangayDto>(barangay);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating barangay for municipality {MunicipalityId}", barangayDto.MunicipalityId);
                throw;
            }
        }

        public async Task<BarangayDto> UpdateBarangayAsync(int id, UpdateBarangayDto barangayDto, int municipalityId)
        {
            try
            {
                var existingBarangay = await _barangayRepository.GetByIdAsync(id);
                if (existingBarangay == null || existingBarangay.MunicipalityId != municipalityId)
                    return null;

                _mapper.Map(barangayDto, existingBarangay);
                await _barangayRepository.UpdateAsync(existingBarangay);
                return _mapper.Map<BarangayDto>(existingBarangay);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating barangay {BarangayId} for municipality {MunicipalityId}", id, municipalityId);
                throw;
            }
        }

        public async Task<bool> DeleteBarangayAsync(int id, int municipalityId)
        {
            try
            {
                var barangay = await _barangayRepository.GetByIdAsync(id);
                if (barangay == null || barangay.MunicipalityId != municipalityId)
                    return false;

                var zones = await _zoneRepository.GetByBarangayIdAsync(id);
                if (zones.Any())
                    throw new InvalidOperationException("Cannot delete barangay that has zones");

                await _barangayRepository.DeleteAsync(id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting barangay {BarangayId} for municipality {MunicipalityId}", id, municipalityId);
                throw;
            }
        }

        public async Task<IEnumerable<ZoneDto>> GetZonesByMunicipalityAsync(int municipalityId)
        {
            try
            {
                var barangays = await GetBarangaysByMunicipalityAsync(municipalityId);
                var allZones = new List<Zone>();

                foreach (var barangay in barangays)
                {
                    var barangayZones = await _zoneRepository.GetByBarangayIdAsync(barangay.Id);
                    allZones.AddRange(barangayZones);
                }

                return _mapper.Map<IEnumerable<ZoneDto>>(allZones);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting zones for municipality {MunicipalityId}", municipalityId);
                throw;
            }
        }

        public async Task<IEnumerable<ZoneStatisticsDto>> GetZonesStatisticsAsync(int municipalityId)
        {
            try
            {
                var barangays = await GetBarangaysByMunicipalityAsync(municipalityId);
                var zonesStatistics = new List<ZoneStatisticsDto>();

                foreach (var barangay in barangays)
                {
                    var zones = await _zoneRepository.GetByBarangayIdAsync(barangay.Id);

                    foreach (var zone in zones)
                    {
                        var households = await _householdRepository.GetByZoneIdAsync(zone.Id);
                        var residents = new List<Resident>();

                        foreach (var household in households)
                        {
                            var householdResidents = await _residentRepository.GetResidentsByHouseHoldIdAsync(household.Id);
                            residents.AddRange(householdResidents);
                        }

                        zonesStatistics.Add(new ZoneStatisticsDto
                        {
                            ZoneId = zone.Id,
                            ZoneName = zone.Name,
                            BarangayName = barangay.Name,
                            TotalHouseholds = households.Count(),
                            TotalResidents = residents.Count,
                            AverageHouseholdSize = households.Any() ? Math.Round(residents.Count / (double)households.Count(), 2) : 0
                        });
                    }
                }

                return zonesStatistics;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting zone statistics for municipality {MunicipalityId}", municipalityId);
                throw;
            }
        }

        public async Task<IEnumerable<HouseholdDto>> GetHouseholdsByMunicipalityAsync(int municipalityId)
        {
            try
            {
                var barangays = await GetBarangaysByMunicipalityAsync(municipalityId);
                var allHouseholds = new List<Household>();

                foreach (var barangay in barangays)
                {
                    var zones = await _zoneRepository.GetByBarangayIdAsync(barangay.Id);
                    foreach (var zone in zones)
                    {
                        var zoneHouseholds = await _householdRepository.GetByZoneIdAsync(zone.Id);
                        allHouseholds.AddRange(zoneHouseholds);
                    }
                }

                return _mapper.Map<IEnumerable<HouseholdDto>>(allHouseholds);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting households for municipality {MunicipalityId}", municipalityId);
                throw;
            }
        }

        public async Task<HouseholdStatisticsDto> GetHouseholdStatisticsAsync(int municipalityId)
        {
            try
            {
                var households = await GetHouseholdsByMunicipalityAsync(municipalityId);
                var barangays = await GetBarangaysByMunicipalityAsync(municipalityId);

                var householdCountsByBarangay = new Dictionary<int, int>();

                foreach (var household in households)
                {
                    var barangayId = await GetHouseholdBarangayId(household);
                    if (householdCountsByBarangay.ContainsKey(barangayId))
                    {
                        householdCountsByBarangay[barangayId]++;
                    }
                    else
                    {
                        householdCountsByBarangay[barangayId] = 1;
                    }
                }

                return new HouseholdStatisticsDto
                {
                    TotalHouseholds = households.Count(),
                    AverageHouseholdSize = await CalculateAverageHouseholdSize(municipalityId),
                    HouseholdsByBarangay = barangays.Select(b => new BarangayHouseholdStatistic
                    {
                        BarangayId = b.Id,
                        BarangayName = b.Name,
                        HouseholdCount = householdCountsByBarangay.GetValueOrDefault(b.Id, 0)
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting household statistics for municipality {MunicipalityId}", municipalityId);
                throw;
            }
        }

        public async Task<IEnumerable<ResidentDto>> GetResidentsByMunicipalityAsync(int municipalityId)
        {
            try
            {
                var households = await GetHouseholdsByMunicipalityAsync(municipalityId);
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
                _logger.LogError(ex, "Error getting residents for municipality {MunicipalityId}", municipalityId);
                throw;
            }
        }

        public async Task<ResidentStatisticsDto> GetResidentStatisticsAsync(int municipalityId)
        {
            try
            {
                var residents = await GetResidentsByMunicipalityAsync(municipalityId);
                var barangays = await GetBarangaysByMunicipalityAsync(municipalityId);

                var residentCountsByBarangay = new Dictionary<int, int>();

                foreach (var resident in residents)
                {
                    var barangayId = GetResidentBarangayId(resident);
                    if (residentCountsByBarangay.ContainsKey(barangayId))
                    {
                        residentCountsByBarangay[barangayId]++;
                    }
                    else
                    {
                        residentCountsByBarangay[barangayId] = 1;
                    }
                }

                return new ResidentStatisticsDto
                {
                    TotalResidents = residents.Count(),
                    ActiveResidents = residents.Count(r => r.IsActive),
                    HouseholdHeads = residents.Count(r => r.IsHead),
                    GenderDistribution = residents
                        .GroupBy(r => r.Gender ?? "Unknown")
                        .ToDictionary(g => g.Key, g => g.Count()),
                    ResidentsByBarangay = barangays.Select(b => new BarangayResidentStatistic
                    {
                        BarangayId = b.Id,
                        BarangayName = b.Name,
                        ResidentCount = residentCountsByBarangay.GetValueOrDefault(b.Id, 0)
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting resident statistics for municipality {MunicipalityId}", municipalityId);
                throw;
            }
        }

        public async Task<MunicipalityStatisticsDto> GetMunicipalityStatisticsAsync(int municipalityId)
        {
            try
            {
                var barangays = await GetBarangaysByMunicipalityAsync(municipalityId);
                var zones = await GetZonesByMunicipalityAsync(municipalityId);
                var households = await GetHouseholdsByMunicipalityAsync(municipalityId);
                var residents = await GetResidentsByMunicipalityAsync(municipalityId);

                return new MunicipalityStatisticsDto
                {
                    MunicipalityId = municipalityId,
                    TotalBarangays = barangays.Count(),
                    TotalZones = zones.Count(),
                    TotalHouseholds = households.Count(),
                    TotalResidents = residents.Count(),
                    AverageHouseholdSize = households.Any() ? Math.Round(residents.Count() / (double)households.Count(), 2) : 0,
                    BarangayStatistics = await GetBarangayStatisticsAsync(municipalityId)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting municipality statistics for {MunicipalityId}", municipalityId);
                throw;
            }
        }

        public async Task<IEnumerable<BarangayStatisticsDto>> GetBarangayStatisticsAsync(int municipalityId)
        {
            try
            {
                var barangays = await GetBarangaysByMunicipalityAsync(municipalityId);
                var barangayStats = new List<BarangayStatisticsDto>();

                foreach (var barangay in barangays)
                {
                    var zones = await _zoneRepository.GetByBarangayIdAsync(barangay.Id);
                    var households = new List<Household>();
                    var residents = new List<Resident>();

                    foreach (var zone in zones)
                    {
                        var zoneHouseholds = await _householdRepository.GetByZoneIdAsync(zone.Id);
                        households.AddRange(zoneHouseholds);

                        foreach (var household in zoneHouseholds)
                        {
                            var householdResidents = await _residentRepository.GetResidentsByHouseHoldIdAsync(household.Id);
                            residents.AddRange(householdResidents);
                        }
                    }

                    barangayStats.Add(new BarangayStatisticsDto
                    {
                        BarangayId = barangay.Id,
                        BarangayName = barangay.Name,
                        TotalZones = zones.Count(),
                        TotalHouseholds = households.Count,
                        TotalResidents = residents.Count,
                        AverageHouseholdSize = households.Any() ? Math.Round(residents.Count / (double)households.Count, 2) : 0
                    });
                }

                return barangayStats;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting barangay statistics for municipality {MunicipalityId}", municipalityId);
                throw;
            }
        }

        public async Task<MunicipalityReportDto> GenerateMunicipalityReportAsync(int municipalityId)
        {
            try
            {
                var statistics = await GetMunicipalityStatisticsAsync(municipalityId);
                var householdStats = await GetHouseholdStatisticsAsync(municipalityId);
                var residentStats = await GetResidentStatisticsAsync(municipalityId);

                return new MunicipalityReportDto
                {
                    GeneratedAt = DateTime.UtcNow,
                    MunicipalityStatistics = statistics,
                    HouseholdStatistics = householdStats,
                    ResidentStatistics = residentStats,
                    Summary = $"Comprehensive report for municipality {municipalityId} generated on {DateTime.UtcNow:yyyy-MM-dd}"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating report for municipality {MunicipalityId}", municipalityId);
                throw;
            }
        }

        public Task<IEnumerable<UserDto>> GetAdminsByMunicipalityAsync(int municipalityId)
        {
            throw new NotImplementedException();
        }

        private async Task<double> CalculateAverageHouseholdSize(int municipalityId)
        {
            var households = await GetHouseholdsByMunicipalityAsync(municipalityId);
            var residents = await GetResidentsByMunicipalityAsync(municipalityId);

            return households.Any() ? Math.Round(residents.Count() / (double)households.Count(), 2) : 0;
        }

        private async Task<int> GetHouseholdBarangayId(HouseholdDto household)
        {
            try
            {
                var zone = await _zoneRepository.GetByIdAsync(household.ZoneId);
                if (zone == null)
                {
                    _logger.LogWarning("Zone not found for household {HouseholdId}", household.Id);
                    return 0;
                }

                return zone.BarangayId;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting barangay ID for household {HouseholdId}", household.Id);
                return 0;
            }
        }

        private int GetResidentBarangayId(ResidentDto resident)
        {
            return resident.BarangayId;
        }
    }
}