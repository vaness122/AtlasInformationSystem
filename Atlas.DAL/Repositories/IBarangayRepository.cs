using Atlas.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IBarangayRepository
{
    Task<IEnumerable<Barangay>> GetAllAsync();   // Async method
    Task<Barangay> GetByIdAsync(int id);        // Async method
    Task AddAsync(Barangay barangay);            // Async method
    Task UpdateAsync(Barangay barangay);         // Async method
    Task DeleteAsync(int id);                    // Async method
}
