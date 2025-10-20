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
        Task<IEnumerable<HouseholdDto>> GetAllHouseholdsAsync();
        Task<HouseholdDto> GetHouseholdByIdAsync(int id);
        Task<HouseholdDto> CreateHouseholdAsync(CreateHouseholdDto householdDto);
        Task<HouseholdDto> UpdateHouseholdAsync(int id, UpdateHouseholdDto householdDto);
        Task<bool> DeleteHouseholdAsync(int id);
        Task<IEnumerable<HouseholdDto>> GetHouseholdsByZoneAsync(int zoneId);
    }
}
