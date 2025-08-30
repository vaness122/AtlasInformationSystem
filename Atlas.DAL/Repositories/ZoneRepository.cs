using Atlas.Core.Models;
using Atlas.DAL.DbContext;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Atlas.DAL.Repositories
{
    public class ZoneRepository : IZoneRepository
    {
        private readonly AppDbContext _context;

        public ZoneRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<Zone>> GetAllAsync()
        {
            return await _context.Zones.ToListAsync();  
        }

        
        public async Task<Zone> GetByIdAsync(int id)
        {
            return await _context.Zones.FirstOrDefaultAsync(z => z.Id == id);  
        }


        public async Task AddAsync(Zone zone)
        {
            await _context.Zones.AddAsync(zone);  
            await _context.SaveChangesAsync();    
        }

      
        public async Task UpdateAsync(Zone zone)
        {
            _context.Zones.Update(zone);  
            await _context.SaveChangesAsync(); 
        }

        
        public async Task DeleteAsync(int id)
        {
            var zone = await _context.Zones.FindAsync(id);  
            if (zone != null)
            {
                _context.Zones.Remove(zone);  
                await _context.SaveChangesAsync();  
            }
        }
    }
}
