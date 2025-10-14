using Atlas.Core.Models;
using Atlas.Shared.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Atlas.BAL.Services
{
    public class BarangayService : IBarangayService
    {
        private readonly IBarangayRepository _barangayRepository;

        public BarangayService(IBarangayRepository barangayRepository)
        {
            _barangayRepository = barangayRepository;
        }

        public async Task<IEnumerable<BarangayDto>> GetAllBarangaysAsync()
        {
            var barangays = await _barangayRepository.GetAllAsync();

            return barangays.Select(b => new BarangayDto
            {
                Id = b.Id,
                Name = b.Name,
                Code = b.Code,
                MunicipalityId = b.MunicipalityId,
                MunicipalityName = b.Municipality?.Name
            });
        }

        public async Task<IEnumerable<BarangayDto>> GetBarangaysByMunicipalityAsync(int municipalityId)
        {
            var barangays = await _barangayRepository.GetByMunicipalityIdAsync(municipalityId);

            return barangays.Select(b => new BarangayDto
            {
                Id = b.Id,
                Name = b.Name,
                Code = b.Code,
                MunicipalityId = b.MunicipalityId,
                MunicipalityName = b.Municipality?.Name
            });
        }
    }
}
