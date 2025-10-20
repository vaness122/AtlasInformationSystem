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
        Task<IEnumerable<ResidentDto>> GetAllResidentsAsync();
        Task<ResidentDto> GetResidentByIdAsync(int id);
        Task<ResidentDto> CreateResidentAsync(ResidentDto dto);
        Task<bool> UpdateResidentAsync(int id, ResidentDto dto);
        Task<bool> DeleteResidentAsync(int id);

    }
}
