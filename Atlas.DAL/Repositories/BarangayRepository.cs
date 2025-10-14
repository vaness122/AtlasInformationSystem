using Atlas.Core.Models;
using Atlas.DAL.DbContext;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Atlas.DAL.Repositories
{
    public class BarangayRepository : IBarangayRepository
    {
        private readonly AppDbContext _context;

        public BarangayRepository(AppDbContext context)
        {
            _context = context;
        }

        // Get all Barangays with async
        public async Task<IEnumerable<Barangay>> GetAllAsync()
        {
            return await _context.Barangays.Include(b => b.Municipality).ToListAsync();
        }

        // Get Barangay by ID with async
        public async Task<Barangay> GetByIdAsync(int id)
        {
            return await _context.Barangays.Include(b => b.Municipality).FirstOrDefaultAsync(b => b.Id == id);
        }

        // Add a new Barangay with async
        public async Task AddAsync(Barangay barangay)
        {
            await _context.Barangays.AddAsync(barangay);
            await _context.SaveChangesAsync();
        }

        // Update an existing Barangay with async
        public async Task UpdateAsync(Barangay barangay)
        {
            _context.Barangays.Update(barangay);
            await _context.SaveChangesAsync();
        }

        // Delete Barangay by ID with async
        public async Task DeleteAsync(int id)
        {
            var barangay = await _context.Barangays.FindAsync(id);
            if (barangay != null)
            {
                _context.Barangays.Remove(barangay);
                await _context.SaveChangesAsync();
            }
        }

       

        async Task<IEnumerable<Barangay>> IBarangayRepository.GetByMunicipalityIdAsync(int municipalityId)
        {
           return await _context.Barangays
                .Include(b => b.Municipality)
                .Where(b => b.MunicipalityId == municipalityId)
                .ToListAsync();
        }
    }
}
