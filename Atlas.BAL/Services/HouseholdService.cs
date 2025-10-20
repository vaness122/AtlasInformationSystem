using Atlas.Core.Models;
using Atlas.DAL.Repositories;
using Atlas.Shared.DTOs;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.BAL.Services
{
    public class HouseholdService : IHouseholdService
    {
        private readonly IHouseholdRepository _householdRepository;
        private readonly IMapper _mapper;

        public HouseholdService(IHouseholdRepository householdRepository, IMapper mapper)
        {
            _householdRepository = householdRepository;
            _mapper = mapper;
        }

        public async Task<HouseholdDto> CreateHouseholdAsync(CreateHouseholdDto householdDto)
        {
            var household = _mapper.Map<Household>(householdDto);
            await _householdRepository.AddAsync(household);
            return _mapper.Map<HouseholdDto>(household);

        }

        public async Task<bool> DeleteHouseholdAsync(int id)
        {
            var household = await _householdRepository.GetByIdAsync(id);
            if (household == null) return false;

            await _householdRepository.DeleteAsync(id);
            return true;
        }

        public async Task<IEnumerable<HouseholdDto>> GetAllHouseholdsAsync()
        {
            var households = await _householdRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<HouseholdDto>>(households);
        }

        public async Task<HouseholdDto> GetHouseholdByIdAsync(int id)
        {
            var household = await _householdRepository.GetByIdAsync(id);
            return _mapper.Map<HouseholdDto>(household);
        }

        public async Task<IEnumerable<HouseholdDto>> GetHouseholdsByZoneAsync(int zoneId)
        {
            var households = await _householdRepository.GetByZoneIdAsync(zoneId);
            return _mapper.Map<IEnumerable<HouseholdDto>>(households);
        }

        public async Task<HouseholdDto> UpdateHouseholdAsync(int id, UpdateHouseholdDto householdDto)
        {
            var existingHousehold = await _householdRepository.GetByIdAsync(id);
            if (existingHousehold == null) return null;

            _mapper.Map(householdDto, existingHousehold);
            await _householdRepository.UpdateAsync(existingHousehold);
            return _mapper.Map<HouseholdDto>(existingHousehold);
        }
    }
}
