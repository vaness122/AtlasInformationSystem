using Atlas.Core.Models.Residents;
using Atlas.DAL.DbContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Atlas.DAL.Repositories
{
    public class ResidentRepository : IResidentRepository
    {
        private readonly AppDbContext _context;

        public ResidentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Resident resident)
        {
            try
            {
                await _context.Residents.AddAsync(resident);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while adding resident: {ex.Message}");
                throw;
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var resident = await _context.Residents.FirstOrDefaultAsync(r => r.Id == id);
                if (resident == null)
                {
                    throw new KeyNotFoundException($"Resident with id {id} not found.");
                }

                _context.Residents.Remove(resident);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while deleting resident: {ex.Message}");
                throw;
            }
        }

        public async Task<IEnumerable<Resident>> GetAllAsync()
        {
            try
            {
                return await _context.Residents
                                     .Include(r => r.Zone)
                                     .Include(r => r.Household)
                                     .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while fetching all residents: {ex.Message}");
                throw;
            }
        }

        public async Task<Resident> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Residents
                                     .Include(r => r.Zone)
                                     .Include(r => r.Household)
                                     .FirstOrDefaultAsync(r => r.Id == id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while fetching resident by id: {ex.Message}");
                throw;
            }
        }

        public async Task UpdateAsync(Resident resident)
        {
            try
            {
                var existingResident = await _context.Residents.FirstOrDefaultAsync(r => r.Id == resident.Id);
                if (existingResident == null)
                {
                    throw new KeyNotFoundException($"Resident with id {resident.Id} not found.");
                }

                // Update fields
                existingResident.FirstName = resident.FirstName;
                existingResident.LastName = resident.LastName;
                existingResident.MiddleName = resident.MiddleName;
                existingResident.Birthdate = resident.Birthdate;
                existingResident.Gender = resident.Gender;
                existingResident.CivilStatus = resident.CivilStatus;
                existingResident.Occupation = resident.Occupation;
                existingResident.Email = resident.Email;
                existingResident.Address = resident.Address;
                existingResident.ZoneId = resident.ZoneId;
                existingResident.HousholdId = resident.HousholdId;
                existingResident.IsHead = resident.IsHead;

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while updating resident: {ex.Message}");
                throw;
            }
        }

        public async Task<IEnumerable<Resident>> GetResidentsByHouseHoldIdAsync(int householdId)
        {
            return await _context.Residents
                           .Where(r => r.HousholdId == householdId)
                           .Include(r => r.Zone)
                           .Include(r => r.Household)
                           .ToListAsync();
        }
    }
}
