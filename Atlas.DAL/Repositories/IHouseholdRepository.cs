using Atlas.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Atlas.DAL.Repositories
{
    public interface IHouseholdRepository
    {
        Task<IEnumerable<Household>> GetAllAsync();  
        Task<Household> GetByIdAsync(int id);  
        Task AddAsync(Household household);  
        Task UpdateAsync(Household household); 
        Task DeleteAsync(int id);
        Task<IEnumerable<Household>> GetByZoneIdAsync(int zoneId);
    }
}
