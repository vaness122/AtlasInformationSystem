using Atlas.Core.Models;
using Atlas.Core.Models.Residents;
using Atlas.DAL.DbContext;
using Atlas.Shared.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SystemStatistics = Atlas.Shared.DTOs.SystemStatisticsDto;

namespace Atlas.DAL.Repositories
{
    public class SuperAdminRepository : ISuperAdminRepository
    {
        private readonly AppDbContext _context;
        private readonly ILogger<SuperAdminRepository> _logger;

        public SuperAdminRepository(AppDbContext context,
            ILogger<SuperAdminRepository> logger)
        {
            _context = context;
            _logger = logger;
        }




        
        public async Task<Barangay> CreateBarangayAsync(Barangay barangay)
        {
            _context.Barangays.Add(barangay);
            await _context.SaveChangesAsync();
            return barangay;
        }

        public async Task<Household> CreateHouseholdAsync(Household household)
        {
            _context.Households.Add(household);
            await _context.SaveChangesAsync();
            return household;
        }

        public async Task<Municipality> CreateMunicipalityAsync(Municipality municipality)
        {
            _context.Municipalities.Add(municipality);
            await _context.SaveChangesAsync();
            return municipality;
        }

        public async Task<Resident> CreateResidentAsync(Resident resident)
        {
            _context.Residents.Add(resident);
            await _context.SaveChangesAsync();
            return resident;
        }

        public async Task<Zone> CreateZoneAsync(Zone zone)
        {
            _context.Zones.Add(zone);
            await _context.SaveChangesAsync();
            return zone;
        }

        public async Task<bool> DeactivateAdminAsync(string id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null) return false;

                user.LockoutEnd = DateTime.MaxValue;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deactivating admin {AdminId}", id);
                throw;
            }

        }

        public async Task<bool> DeleteBarangayAsync(int id)
        {
            var barangay = await _context.Barangays
                .Include(b => b.Zones)
                .Include(b => b.Admins)
                .FirstOrDefaultAsync(b => b.Id == id);
            if (barangay == null) return false;
            if (barangay.Zones.Any() || barangay.Admins.Any())
                throw new InvalidOperationException("cannot delete barangay that has zones or admins");

            _context.Barangays.Remove(barangay);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteHouseholdAsync(int id)
        {
            var household = await _context.Households
                .Include(h => h.Residents)
                .FirstOrDefaultAsync(h => h.Id == id);

            if (household == null) return false;

            if (household.Residents.Any())
                throw new InvalidOperationException("Cannot delete household that has residents");

            _context.Households.Remove(household);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteMunicipalityAsync(int id)
        {
            var municipality = await _context.Municipalities
                 .Include(m => m.Barangays)
                 .Include(m => m.Admins)
                 .FirstOrDefaultAsync(m => m.Id == id);

            if (municipality == null) return false;

            if (municipality.Barangays.Any() || municipality.Admins.Any())
                throw new InvalidOperationException("Cannot delete municipality that has barangays or admins");

            _context.Municipalities.Remove(municipality);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteResidentAsync(int id)
        {
            var resident = await _context.Residents.FindAsync(id);
            if (resident == null) return false;

            _context.Residents.Remove(resident);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteZoneAsync(int id)
        {
            var zone = await _context.Zones
                .Include(z => z.Households)
                .FirstOrDefaultAsync(z => z.Id == id);

            if (zone == null) return false;

            if (zone.Households.Any())
                throw new InvalidOperationException("Cannot delete zone that has households");

            _context.Zones.Remove(zone);
            await _context.SaveChangesAsync();
            return true;
           
        }

        public async Task<IEnumerable<AppUser>> GetAllAdminsAsync()
        {
            try
            {
                return await _context.Users
                    .Where(u => u.Role == Core.Enum.UserRole.MunicipalityAdmin ||
                               u.Role == Core.Enum.UserRole.BarangayAdmin)
                    .Include(u => u.Municipality)
                    .Include(u => u.Barangay)
                    .OrderBy(u => u.Role)
                    .ThenBy(u => u.UserName)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all admins");
                throw;
            }
        }

        public async Task<IEnumerable<Barangay>> GetAllBarangaysAsync()
        {
            return await _context.Barangays
                .Include(b => b.Municipality)
                .Include(b => b.Zones)
                .Include(b => b.Admins)
                .OrderBy(b => b.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Household>> GetAllHouseholdsAsync()
        {
            return await _context.Households
                .Include(h => h.Zone)
                .ThenInclude(z => z.Barangay)
                .ThenInclude(b => b.Municipality)
                .Include(h => h.Residents)
                .OrderBy(h => h.HouseHoldName)
                .ToListAsync();
        }

        public async Task<IEnumerable<Municipality>> GetAllMunicipalitiesAsync()
        {
            return await _context.Municipalities
                .Include(m => m.Barangays)
                .Include(m => m.Admins)
                .OrderBy(m => m.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Resident>> GetAllResidentsAsync()
        {
            return await _context.Residents
                .Include(r => r.Household)
                .Include(r => r.Municipality)
                .Include(r => r.Barangay)
                .Include(r => r.Zone)
                .OrderBy(r => r.LastName)
                .ThenBy(r => r.FirstName)
                .ToListAsync();
        }

        public async Task<IEnumerable<Zone>> GetAllZonesAsync()
        {
            return await _context.Zones
                .Include(z => z.Barangay)
                .ThenInclude(b => b.Municipality)
                .Include(z => z.Households)
                .OrderBy(z => z.Name)
                .ToListAsync();
        }

        public async Task<Barangay> GetBarangayByIdAsync(int id)
        {
            return await _context.Barangays
               .Include(b => b.Municipality)
               .Include(b => b.Zones)
               .Include(b => b.Admins)
               .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<Household> GetHouseholdByIdAsync(int id)
        {
            return await _context.Households
                .Include(h => h.Zone)
                .ThenInclude(z => z.Barangay)
                .ThenInclude(b => b.Municipality)
                .Include(h => h.Residents)
                .FirstOrDefaultAsync(h => h.Id == id);
        }

        public async Task<Municipality> GetMunicipalityByIdAsync(int id)
        {
            return await _context.Municipalities
              .Include(m => m.Barangays)
              .Include(m => m.Admins)
              .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<IEnumerable<MunicipalityStatisticsDto>> GetMunicipalityStatisticsAsync()
        {
            try
            {
                var stats = await _context.Municipalities
                    .Select(m => new MunicipalityStatisticsDto
                    {
                        MunicipalityId = m.Id,
                        MunicipalityName = m.Name,
                        TotalBarangays = m.Barangays.Count,
                        TotalZones = m.Barangays.SelectMany(b => b.Zones).Count(),
                        TotalHouseholds = m.Barangays.SelectMany(b => b.Zones).SelectMany(z => z.Households).Count(),
                        TotalResidents = m.Barangays.SelectMany(b => b.Zones).SelectMany(z => z.Households).SelectMany(h => h.Residents).Count(),
                        ActiveAdmins = m.Admins.Count(a => a.LockoutEnd == null || a.LockoutEnd < DateTime.Now)
                    })
                    .ToListAsync();

                foreach (var stat in stats)
                {
                    stat.AverageHouseholdSize = stat.TotalHouseholds > 0
                        ? Math.Round(stat.TotalResidents / (double)stat.TotalHouseholds, 2)
                        : 0;
                }

                return stats;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting municipality statistics");
                throw;
            }
        }

        public async Task<Resident> GetResidentByIdAsync(int id)
        {
            return await _context.Residents
                .Include(r => r.Household)
                .Include(r => r.Municipality)
                .Include(r => r.Barangay)
                .Include(r => r.Zone)
                .FirstOrDefaultAsync(r => r.Id == id);
        }




        public async Task<SystemOverviewDto> GetSystemOverviewAsync(SystemStatistics systemStats)
        {
           try
            {
                // Run all required queries in parallel for better performance
                var systemStatsTask = GetSystemStatisticsAsync();
                var municipalityStatsTask = GetMunicipalityStatisticsAsync();
                var adminsTask = _context.Users
                    .Where(u => u.Role == Core.Enum.UserRole.MunicipalityAdmin || 
                               u.Role == Core.Enum.UserRole.BarangayAdmin)
                    .ToListAsync();

                await Task.WhenAll(systemStatsTask, municipalityStatsTask, adminsTask);

                var systemStatsResult = await systemStatsTask;
                var municipalityStatsResult = await municipalityStatsTask;
                var admins = await adminsTask;

                var activeAdmins = admins.Count(u => u.LockoutEnd == null || u.LockoutEnd < DateTime.Now);

                return new SystemOverviewDto
                {
                  
                    MunicipalityStatistics = municipalityStatsResult,
                    ActiveAdmins = activeAdmins,
                    InactiveAdmins = admins.Count - activeAdmins,
                    LastUpdated = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system overview");
                throw;
            }
        }

        public async Task<SystemStatisticsDto> GetSystemStatisticsAsync()
        {
            try
            {
                var municipalities = await _context.Municipalities.CountAsync();
                var barangays = await _context.Barangays.CountAsync();
                var zones = await _context.Zones.CountAsync();
                var households = await _context.Households.CountAsync();
                var residents = await _context.Residents.CountAsync();

                var admins = await _context.Users
                    .Where(u => u.Role == Core.Enum.UserRole.MunicipalityAdmin ||
                    u.Role == Core.Enum.UserRole.BarangayAdmin)
                    .ToListAsync();

                var totalAdmins = admins.Count;
                var activeAdmins = admins.Count(u => u.LockoutEnd == null || u.LockoutEnd < DateTime.Now);

                var adminsByRole = admins
                    .GroupBy(u => u.Role.ToString())
                    .ToDictionary(g => g.Key, g => g.Count());

                var avgHouseholdSize = households > 0 ? Math.Round(residents / (double)households, 2) : 0;

                return new SystemStatisticsDto
                {
                    TotalMunicipalities = municipalities,
                    TotalBarangays = barangays,
                    TotalZones = zones,
                    TotalHouseholds = households,
                    TotalResidents = residents,
                    TotalAdmins = totalAdmins,
                    ActiveAdmins = activeAdmins,
                    InactiveAdmins = totalAdmins - activeAdmins,
                    AdminsByRole = adminsByRole,
                    AverageHouseholdSize = avgHouseholdSize
                };
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error getting system statistics");
                throw;
            }

        }

        public Task<SystemOverviewDto> GetSystemOverviewAsync()
        {
            throw new NotImplementedException();
        }

     

        public async Task<Zone> GetZoneByIdAsync(int id)
        {
            return await _context.Zones
                 .Include(z => z.Barangay)
                 .ThenInclude(b => b.Municipality)
                 .Include(z => z.Households)
                 .FirstOrDefaultAsync(z => z.Id == id);
        }

        public async Task<bool> ReactivateAdminAsync(string id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null) return false;

                user.LockoutEnd = null;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reactivating admin {AdminId}", id);
                throw;
            }
        }

        public async Task<Barangay> UpdateBarangayAsync(Barangay barangay)
        {
            _context.Barangays.Update(barangay);
            await _context.SaveChangesAsync();
            return barangay;
        }

        public async Task<Household> UpdateHouseholdAsync(Household household)
        {
            _context.Households.Update(household);
            await _context.SaveChangesAsync();
            return household;
        }

        public async Task<Municipality> UpdateMunicipalityAsync(Municipality municipality)
        {
            _context.Municipalities.Update(municipality);
            await _context.SaveChangesAsync();
            return municipality;
        }

        public async Task<Resident> UpdateResidentAsync(Resident resident)
        {
            _context.Residents.Update(resident);
            await _context.SaveChangesAsync();
            return resident;
        }

        public async Task<Zone> UpdateZoneAsync(Zone zone)
        {
            _context.Zones.Update(zone);
            await _context.SaveChangesAsync();
            return zone;
        }
    }
}
