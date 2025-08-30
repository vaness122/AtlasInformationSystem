using Atlas.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IZoneRepository
{
    Task<IEnumerable<Zone>> GetAllAsync(); 
    Task<Zone> GetByIdAsync(int id);       
    Task AddAsync(Zone zone);              
    Task UpdateAsync(Zone zone);            
    Task DeleteAsync(int id);              
}