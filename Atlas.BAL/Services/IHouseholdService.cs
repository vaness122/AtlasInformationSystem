using Atlas.Shared.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.BAL.Services
{
   public interface IHouseholdService
    {
        Task<HouseholdDto> GetHousehold(int id);
        Task<IEnumerable<HouseholdDto>> GetAllHouseHoldAsync(int id);
        Task<HouseholdDto> CreateHouseholdAsync(HouseholdDto household);
        Task<HouseholdDto> UpdateHouseholdAsync(HouseholdDto household);
        Task DeleteHouseholdAsync (int id);
    }
}
