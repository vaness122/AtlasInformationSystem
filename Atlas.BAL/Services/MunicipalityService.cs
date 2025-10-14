using Atlas.Shared.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.BAL.Services
{
    public class MunicipalityService : IMunicipalityService
    {
        private readonly IMunicipalityRepository _municipalityRepository;
        public MunicipalityService(IMunicipalityRepository municipalityRepository)

        {
            _municipalityRepository = municipalityRepository;
        }

        public async Task<IEnumerable<MunicipalityDto>> GetAllMunicipalitiesAsync()
        {
            var municipalities = await _municipalityRepository.GetAllAsync();


            return municipalities.Select(m => new MunicipalityDto
            {
                Id = m.Id,
                Name = m.Name,
                Code = m.Code,
                Region = m.Region,
                Province = m.Province
            });
        }
    }
}
