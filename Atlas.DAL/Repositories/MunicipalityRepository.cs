using Atlas.Core.Models;
using Atlas.DAL.DbContext;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Atlas.DAL.Repositories
{
    public class MunicipalityRepository : IMunicipalityRepository
    {
        private readonly AppDbContext _context;

        public MunicipalityRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Municipality>> GetAllAsync()
        {
            return await _context.Municipalities.ToListAsync();
        }

        public async Task<Municipality> GetByIdAsync(int id)
        {
            return await _context.Municipalities.FirstOrDefaultAsync(m => m.Id == id);  
        }

        public async Task AddAsync(Municipality municipality)
        {
            await _context.Municipalities.AddAsync(municipality); 
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Municipality municipality)
        {
            _context.Municipalities.Update(municipality);  
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var municipality = await _context.Municipalities.FindAsync(id);
            if (municipality != null)
            {
                _context.Municipalities.Remove(municipality);  
                await _context.SaveChangesAsync();
            }
        }
    }
}
