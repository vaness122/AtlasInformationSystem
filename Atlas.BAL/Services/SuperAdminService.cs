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
    public class SuperAdminService : ISuperAdmin
    {
        private readonly MunicipalityRepository _municipalityRepository;
private readonly IBarangayRepository _barangayRepository;
        private readonly IMapper _mapper;





        public Task<MunicipalityDto> CreateMunicipalityAsync(MunicipalityDto dto)
        {
            throw new NotImplementedException();
        }

        public Task DeleteMunicipalityAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<BarangayDto>> GetAllBarangayAsync()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<MunicipalityDto>> GetAllMunicipalityAsync()
        {
            throw new NotImplementedException();
        }

        public Task UpdateMunicipality(MunicipalityDto dto)
        {
            throw new NotImplementedException();
        }
    }
}
