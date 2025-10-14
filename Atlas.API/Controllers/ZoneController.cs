using Atlas.BAL.Services;
using Atlas.Shared.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Atlas.API.Controllers
{
    [ApiController]
    [Route("api/zones")]
    public class ZoneController : ControllerBase
    {

        private readonly IZoneService _zoneService;
        public ZoneController(IZoneService zoneService)
        {
            _zoneService = zoneService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ZoneDto>>> GetZones()
        {
            var zones = await _zoneService.GetAllZonesAsync();
            return Ok(zones);
        }

    }
}
