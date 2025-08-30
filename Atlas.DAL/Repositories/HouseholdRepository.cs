using Atlas.Core.Models;
using Atlas.DAL.DbContext;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Atlas.DAL.Repositories
{
    public class HouseholdRepository : IHouseholdRepository
    {
        private readonly AppDbContext _context;

        public HouseholdRepository(AppDbContext context)
        {
            _context = context;
        }

       
        public async Task<IEnumerable<Household>> GetAllAsync()
        {
            return await _context.Households.Include(h => h.Residents).ToListAsync();
        }

        public async Task<Household> GetByIdAsync(int id)
        {
            return await _context.Households.Include(h => h.Residents).FirstOrDefaultAsync(h => h.Id == id);
        }

        public async Task AddAsync(Household household)
        {
            await _context.Households.AddAsync(household);
            await _context.SaveChangesAsync();
        }

     
        public async Task UpdateAsync(Household household)
        {
            _context.Households.Update(household);
            await _context.SaveChangesAsync();
        }

      
        public async Task DeleteAsync(int id)
        {
            var household = await _context.Households.FindAsync(id);
            if (household != null)
            {
                _context.Households.Remove(household);
                await _context.SaveChangesAsync();
            }
        }
    }
}
