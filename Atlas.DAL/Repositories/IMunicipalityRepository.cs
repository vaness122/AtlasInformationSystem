using Atlas.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IMunicipalityRepository
{
    Task<IEnumerable<Municipality>> GetAllAsync();
    Task<Municipality> GetByIdAsync(int id);
    Task AddAsync(Municipality municipality);
    Task UpdateAsync(Municipality municipality);
    Task DeleteAsync(int id);

}