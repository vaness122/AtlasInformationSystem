using Atlas.BAL.Services;
using Atlas.Shared.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Atlas.API.Controllers
{
    [ApiController]
    [Route("api/municipalities")]
    public class MunicipalityController : ControllerBase
    {

        private readonly IMunicipalityService _municipalityService;
        private readonly IBarangayService _barangayService;

        public MunicipalityController(IMunicipalityService municipalityService , IBarangayService barangayService)
        {
            _municipalityService = municipalityService;
            _barangayService = barangayService;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<MunicipalityDto>>> GetMunicipalities()
        {
            var municipalities = await _municipalityService.GetAllMunicipalitiesAsync();
            return Ok(municipalities);
        }

        [HttpGet("{id}/barangays")]
        public async Task<ActionResult<IEnumerable<BarangayDto>>> GetBarangaysByMunicipality(int id)
        {
            var barangays = await _barangayService.GetBarangaysByMunicipalityAsync(id);
            return Ok(barangays);
        }




    }
}
