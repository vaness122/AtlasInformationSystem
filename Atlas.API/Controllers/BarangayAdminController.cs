using Atlas.Shared.DTOs;
using Atlas.BAL.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Atlas.API.Controllers
{
    [ApiController]
    [Route("api/barangay-admin")]
    [Authorize(Roles = "BarangayAdmin")]
    public class BarangayAdminController : ControllerBase
    {
        private readonly IBarangayAdminService _barangayAdminService;
        private readonly ILogger<BarangayAdminController> _logger;

        public BarangayAdminController(
            IBarangayAdminService barangayAdminService,
            ILogger<BarangayAdminController> logger)
        {
            _barangayAdminService = barangayAdminService;
            _logger = logger;
        }



        [HttpGet("zones")]
        public async Task<ActionResult<IEnumerable<ZoneDto>>> GetZones()
        {
            try
            {
                var barangayId = GetUserBarangayId();
                var zones = await _barangayAdminService.GetZonesByBarangayAsync(barangayId);
                return Ok(zones);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting zones for barangay admin");
                return StatusCode(500, new { message = "An error occurred while retrieving zones" });
            }
        }

        [HttpGet("zones/{id}")]
        public async Task<ActionResult<ZoneDto>> GetZoneById(int id)
        {
            try
            {
                var barangayId = GetUserBarangayId();
                var zone = await _barangayAdminService.GetZoneByIdAsync(id, barangayId);

                if (zone == null)
                    return NotFound(new { message = "Zone not found or access denied" });

                return Ok(zone);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting zone {ZoneId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the zone" });
            }
        }

        [HttpPost("zones")]
        public async Task<ActionResult<ZoneDto>> CreateZone(CreateZoneDto zoneDto)
        {
            try
            {
                var barangayId = GetUserBarangayId();


                if (zoneDto.BarangayId != barangayId)
                    return BadRequest(new { message = "Cannot create zone for different barangay" });

                var zone = await _barangayAdminService.CreateZoneAsync(zoneDto);
                return CreatedAtAction(nameof(GetZoneById), new { id = zone.Id }, zone);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating zone");
                return StatusCode(500, new { message = "An error occurred while creating the zone" });
            }
        }

        [HttpPut("zones/{id}")]
        public async Task<ActionResult<ZoneDto>> UpdateZone(int id, UpdateZoneDto zoneDto)
        {
            try
            {
                var barangayId = GetUserBarangayId();
                var zone = await _barangayAdminService.UpdateZoneAsync(id, zoneDto, barangayId);

                if (zone == null)
                    return NotFound(new { message = "Zone not found or access denied" });

                return Ok(zone);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating zone {ZoneId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the zone" });
            }
        }

        [HttpDelete("zones/{id}")]
        public async Task<ActionResult> DeleteZone(int id)
        {
            try
            {
                var barangayId = GetUserBarangayId();
                var result = await _barangayAdminService.DeleteZoneAsync(id, barangayId);

                if (!result)
                    return NotFound(new { message = "Zone not found or access denied" });

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting zone {ZoneId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the zone" });
            }
        }



        [HttpGet("households")]
        public async Task<ActionResult<IEnumerable<HouseholdDto>>> GetHouseholds()
        {
            try
            {
                var barangayId = GetUserBarangayId();
                var households = await _barangayAdminService.GetHouseholdsByBarangayAsync(barangayId);
                return Ok(households);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting households for barangay admin");
                return StatusCode(500, new { message = "An error occurred while retrieving households" });
            }
        }

        [HttpGet("households/{id}")]
        public async Task<ActionResult<HouseholdDto>> GetHouseholdById(int id)
        {
            try
            {
                var barangayId = GetUserBarangayId();
                var household = await _barangayAdminService.GetHouseholdByIdAsync(id, barangayId);

                if (household == null)
                    return NotFound(new { message = "Household not found or access denied" });

                return Ok(household);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting household {HouseholdId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the household" });
            }
        }

        [HttpPost("households")]
        public async Task<ActionResult<HouseholdDto>> CreateHousehold(CreateHouseholdDto householdDto)
        {
            try
            {
                var barangayId = GetUserBarangayId();

                // Ensure the household belongs to the admin's barangay
                if (householdDto.BarangayId != barangayId)
                    return BadRequest(new { message = "Cannot create household for different barangay" });

                var household = await _barangayAdminService.CreateHouseholdAsync(householdDto);
                return CreatedAtAction(nameof(GetHouseholdById), new { id = household.Id }, household);
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating household");
                return StatusCode(500, new { message = "An error occurred while creating the household" });
            }
        }

        [HttpPut("households/{id}")]
        public async Task<ActionResult<HouseholdDto>> UpdateHousehold(int id, UpdateHouseholdDto householdDto)
        {
            try
            {
                var barangayId = GetUserBarangayId();
                var household = await _barangayAdminService.UpdateHouseholdAsync(id, householdDto, barangayId);

                if (household == null)
                    return NotFound(new { message = "Household not found or access denied" });

                return Ok(household);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating household {HouseholdId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the household" });
            }
        }

        [HttpDelete("households/{id}")]
        public async Task<ActionResult> DeleteHousehold(int id)
        {
            try
            {
                var barangayId = GetUserBarangayId();
                var result = await _barangayAdminService.DeleteHouseholdAsync(id, barangayId);

                if (!result)
                    return NotFound(new { message = "Household not found or access denied" });

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting household {HouseholdId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the household" });
            }
        }

        [HttpGet("zones/{zoneId}/households")]
        public async Task<ActionResult<IEnumerable<HouseholdDto>>> GetHouseholdsByZone(int zoneId)
        {
            try
            {
                var barangayId = GetUserBarangayId();
                var households = await _barangayAdminService.GetHouseholdsByZoneAsync(zoneId, barangayId);
                return Ok(households);
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting households for zone {ZoneId}", zoneId);
                return StatusCode(500, new { message = "An error occurred while retrieving households" });
            }
        }



        [HttpGet("residents")]
        public async Task<ActionResult<IEnumerable<ResidentDto>>> GetResidents()
        {
            try
            {
                var barangayId = GetUserBarangayId();
                var residents = await _barangayAdminService.GetResidentsByBarangayAsync(barangayId);
                return Ok(residents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting residents for barangay admin");
                return StatusCode(500, new { message = "An error occurred while retrieving residents" });
            }
        }

        [HttpGet("residents/{id}")]
        public async Task<ActionResult<ResidentDto>> GetResidentById(int id)
        {
            try
            {
                var barangayId = GetUserBarangayId();
                var resident = await _barangayAdminService.GetResidentByIdAsync(id, barangayId);

                if (resident == null)
                    return NotFound(new { message = "Resident not found or access denied" });

                return Ok(resident);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting resident {ResidentId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the resident" });
            }
        }

        [HttpPost("residents")]
        public async Task<ActionResult<ResidentDto>> CreateResident(CreateResidentDto residentDto)
        {
            try
            {
                var barangayId = GetUserBarangayId();


                if (residentDto.BarangayId != barangayId)
                    return BadRequest(new { message = "Cannot create resident for different barangay" });

                var resident = await _barangayAdminService.CreateResidentAsync(residentDto);
                return CreatedAtAction(nameof(GetResidentById), new { id = resident.Id }, resident);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating resident");
                return StatusCode(500, new { message = "An error occurred while creating the resident" });
            }
        }

        [HttpPut("residents/{id}")]
        public async Task<ActionResult<ResidentDto>> UpdateResident(int id, UpdateResidentDto residentDto)
        {
            try
            {
                var barangayId = GetUserBarangayId();
                var resident = await _barangayAdminService.UpdateResidentAsync(id, residentDto, barangayId);

                if (resident == null)
                    return NotFound(new { message = "Resident not found or access denied" });

                return Ok(resident);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating resident {ResidentId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the resident" });
            }
        }

        [HttpDelete("residents/{id}")]
        public async Task<ActionResult> DeleteResident(int id)
        {
            try
            {
                var barangayId = GetUserBarangayId();
                var result = await _barangayAdminService.DeleteResidentAsync(id, barangayId);

                if (!result)
                    return NotFound(new { message = "Resident not found or access denied" });

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting resident {ResidentId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the resident" });
            }
        }

        [HttpGet("households/{householdId}/residents")]
        public async Task<ActionResult<IEnumerable<ResidentDto>>> GetResidentsByHousehold(int householdId)
        {
            try
            {
                var barangayId = GetUserBarangayId();
                var residents = await _barangayAdminService.GetResidentsByHouseholdAsync(householdId, barangayId);
                return Ok(residents);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting residents for household {HouseholdId}", householdId);
                return StatusCode(500, new { message = "An error occurred while retrieving residents" });
            }
        }



        [HttpGet("statistics")]
        public async Task<ActionResult<BarangayStatisticsDto>> GetStatistics()
        {
            try
            {
                var barangayId = GetUserBarangayId();
                var statistics = await _barangayAdminService.GetBarangayStatisticsAsync(barangayId);
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting statistics for barangay admin");
                return StatusCode(500, new { message = "An error occurred while retrieving statistics" });
            }
        }

        [HttpGet("zones/{zoneId}/statistics")]
        public async Task<ActionResult<ZoneStatisticsDto>> GetZoneStatistics(int zoneId)
        {
            try
            {
                var barangayId = GetUserBarangayId();
                var statistics = await _barangayAdminService.GetZoneStatisticsAsync(zoneId, barangayId);
                return Ok(statistics);
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting statistics for zone {ZoneId}", zoneId);
                return StatusCode(500, new { message = "An error occurred while retrieving statistics" });
            }
        }

        // ===== HELPER METHODS =====
        private int GetUserBarangayId()
        {
            var barangayIdClaim = User.FindFirst("BarangayId")?.Value;
            if (string.IsNullOrEmpty(barangayIdClaim))
            {
                throw new UnauthorizedAccessException("BarangayId claim is missing");
            }
            return int.Parse(barangayIdClaim);
        }
    }
}