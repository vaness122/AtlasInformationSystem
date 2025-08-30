using Atlas.Core.Models.Residents;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IResidentRepository
{
    Task<IEnumerable<Resident>> GetAllAsync();
    Task<Resident> GetByIdAsync(int id);
    Task AddAsync(Resident resident);
    Task UpdateAsync(Resident resident);
    Task DeleteAsync(int id);
    Task<IEnumerable<Resident>> GetResidentsByHouseHoldIdAsync(int householdId);
}
