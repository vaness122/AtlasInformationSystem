using Atlas.BAL.Services;
using Atlas.Shared.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Atlas.API.Controllers
{
    [ApiController]
    [Route("api/barangays")]
    public class BarangayController : ControllerBase
    {
        private readonly IBarangayService _barangayService;
        private readonly IZoneService _zoneService;
        public BarangayController(IBarangayService barangayService,
            IZoneService zoneService)
        {
            _barangayService = barangayService;
            _zoneService = zoneService;
        }
    

    [HttpGet]
        public async Task<ActionResult<IEnumerable<BarangayDto>>> GetBarangays()
        {
            var barangays = await _barangayService.GetAllBarangaysAsync();
            return Ok(barangays);
        }

        [HttpGet("{id}/zones")]
        public async Task<ActionResult<IEnumerable<ZoneDto>>> GetZonesByBarangayAsync(int id)
        {
            var zones = await _zoneService.GetZonesByBarangayAsync(id);
            return Ok(zones);
        }




    }

}
