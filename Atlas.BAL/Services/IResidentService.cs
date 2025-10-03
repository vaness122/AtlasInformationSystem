 using Atlas.Shared.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.BAL.Services
{
    public interface IResidentService
    {
        Task<ResidentDto> GetByIdAsync(int id);
        Task<IEnumerable<ResidentDto>> GetAllResidentAsync();
        
        Task<ResidentDto> CreateAsync(ResidentDto residentDto);
        Task<ResidentDto> UpdateAsync(ResidentDto residentDto);
        Task<ResidentDto> DeleteAsync(int id);
        
      
    }
}
