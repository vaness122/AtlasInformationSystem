using Atlas.Core.Models.Residents;
using Atlas.Shared.DTOs;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.BAL.Services
{
    public class ResidentService : IResidentService
    {

        private readonly IResidentRepository _residentRepository;
        private readonly IMapper _mapper;
        public ResidentService(IResidentRepository residentRepository, IMapper mapper)
        {
            _residentRepository = residentRepository;
            _mapper = mapper;
        }


        public async Task<ResidentDto> CreateResidentAsync(ResidentDto dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto));

            var resident = _mapper.Map<Resident>(dto);
            await _residentRepository.AddAsync(resident);

            return _mapper.Map<ResidentDto>(resident);
        }

        public async Task<bool> DeleteResidentAsync(int id)
        {
            var resident = await _residentRepository.GetByIdAsync(id);
            if (resident == null) return false;

            await _residentRepository.DeleteAsync(id);
            return true;
        }

        public async Task<IEnumerable<ResidentDto>> GetAllResidentsAsync()
        {
            var residents = await _residentRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ResidentDto>>(residents);
        }

        public async Task<ResidentDto> GetResidentByIdAsync(int id)
        {
            var resident = await _residentRepository.GetByIdAsync(id);
            return _mapper.Map<ResidentDto>(resident);
        }

        public async Task<bool> UpdateResidentAsync(int id, ResidentDto dto)
        {
            var existingResident = await _residentRepository.GetByIdAsync(id);
            if(existingResident == null) return false;

            _mapper.Map(dto, existingResident);
            await _residentRepository.UpdateAsync(existingResident);
            return true;
        }
    }
}
