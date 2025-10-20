using Atlas.Shared.DTOs;
using Atlas.BAL.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Atlas.API.Controllers
{
    [ApiController]
    [Route("api/municipality-admin")]
    [Authorize(Roles = "MunicipalityAdmin")]
    public class MunicipalityAdminController : ControllerBase
    {
        private readonly IMunicipalityAdminService _municipalityAdminService;
        private readonly ILogger<MunicipalityAdminController> _logger;

        public MunicipalityAdminController(
            IMunicipalityAdminService municipalityAdminService,
            ILogger<MunicipalityAdminController> logger)
        {
            _municipalityAdminService = municipalityAdminService;
            _logger = logger;
        }



        [HttpGet("barangays")]
        public async Task<ActionResult<IEnumerable<BarangayDto>>> GetBarangays()
        {
            try
            {
                var municipalityId = GetUserMunicipalityId();
                var barangays = await _municipalityAdminService.GetBarangaysByMunicipalityAsync(municipalityId);
                return Ok(barangays);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting barangays for municipality admin");
                return StatusCode(500, new { message = "An error occurred while retrieving barangays" });
            }
        }

        [HttpGet("barangays/{id}")]
        public async Task<ActionResult<BarangayDto>> GetBarangayById(int id)
        {
            try
            {
                var municipalityId = GetUserMunicipalityId();
                var barangay = await _municipalityAdminService.GetBarangayByIdAsync(id, municipalityId);

                if (barangay == null)
                    return NotFound(new { message = "Barangay not found or access denied" });

                return Ok(barangay);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting barangay {BarangayId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the barangay" });
            }
        }

        [HttpPost("barangays")]
        public async Task<ActionResult<BarangayDto>> CreateBarangay(CreateBarangayDto barangayDto)
        {
            try
            {
                var municipalityId = GetUserMunicipalityId();

                // Ensure the barangay belongs to the admin's municipality
                if (barangayDto.MunicipalityId != municipalityId)
                    return BadRequest(new { message = "Cannot create barangay for different municipality" });

                var barangay = await _municipalityAdminService.CreateBarangayAsync(barangayDto);
                return CreatedAtAction(nameof(GetBarangayById), new { id = barangay.Id }, barangay);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating barangay");
                return StatusCode(500, new { message = "An error occurred while creating the barangay" });
            }
        }

        [HttpPut("barangays/{id}")]
        public async Task<ActionResult<BarangayDto>> UpdateBarangay(int id, UpdateBarangayDto barangayDto)
        {
            try
            {
                var municipalityId = GetUserMunicipalityId();
                var barangay = await _municipalityAdminService.UpdateBarangayAsync(id, barangayDto, municipalityId);

                if (barangay == null)
                    return NotFound(new { message = "Barangay not found or access denied" });

                return Ok(barangay);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating barangay {BarangayId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the barangay" });
            }
        }

        [HttpDelete("barangays/{id}")]
        public async Task<ActionResult> DeleteBarangay(int id)
        {
            try
            {
                var municipalityId = GetUserMunicipalityId();
                var result = await _municipalityAdminService.DeleteBarangayAsync(id, municipalityId);

                if (!result)
                    return NotFound(new { message = "Barangay not found or access denied" });

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting barangay {BarangayId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the barangay" });
            }
        }

        [HttpGet("zones")]
        public async Task<ActionResult<IEnumerable<ZoneDto>>> GetZones()
        {
            try
            {
                var municipalityId = GetUserMunicipalityId();
                var zones = await _municipalityAdminService.GetZonesByMunicipalityAsync(municipalityId);
                return Ok(zones);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting zones for municipality admin");
                return StatusCode(500, new { message = "An error occurred while retrieving zones" });
            }
        }



        [HttpGet("households")]
        public async Task<ActionResult<IEnumerable<HouseholdDto>>> GetHouseholds()
        {
            try
            {
                var municipalityId = GetUserMunicipalityId();
                var households = await _municipalityAdminService.GetHouseholdsByMunicipalityAsync(municipalityId);
                return Ok(households);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting households for municipality admin");
                return StatusCode(500, new { message = "An error occurred while retrieving households" });
            }
        }



        [HttpGet("residents")]
        public async Task<ActionResult<IEnumerable<ResidentDto>>> GetResidents()
        {
            try
            {
                var municipalityId = GetUserMunicipalityId();
                var residents = await _municipalityAdminService.GetResidentsByMunicipalityAsync(municipalityId);
                return Ok(residents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting residents for municipality admin");
                return StatusCode(500, new { message = "An error occurred while retrieving residents" });
            }
        }

        // ===== STATISTICS & REPORTS =====

        [HttpGet("statistics")]
        public async Task<ActionResult<MunicipalityStatisticsDto>> GetStatistics()
        {
            try
            {
                var municipalityId = GetUserMunicipalityId();
                var statistics = await _municipalityAdminService.GetMunicipalityStatisticsAsync(municipalityId);
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting statistics for municipality admin");
                return StatusCode(500, new { message = "An error occurred while retrieving statistics" });
            }
        }

        [HttpGet("barangays/statistics")]
        public async Task<ActionResult<IEnumerable<BarangayStatisticsDto>>> GetBarangayStatistics()
        {
            try
            {
                var municipalityId = GetUserMunicipalityId();
                var statistics = await _municipalityAdminService.GetBarangayStatisticsAsync(municipalityId);
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting barangay statistics for municipality admin");
                return StatusCode(500, new { message = "An error occurred while retrieving barangay statistics" });
            }
        }

        [HttpGet("zones/statistics")]
        public async Task<ActionResult<IEnumerable<ZoneStatisticsDto>>> GetZonesStatistics()
        {
            try
            {
                var municipalityId = GetUserMunicipalityId();
                var statistics = await _municipalityAdminService.GetZonesStatisticsAsync(municipalityId);
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting zone statistics for municipality admin");
                return StatusCode(500, new { message = "An error occurred while retrieving zone statistics" });
            }
        }

        [HttpGet("households/statistics")]
        public async Task<ActionResult<HouseholdStatisticsDto>> GetHouseholdStatistics()
        {
            try
            {
                var municipalityId = GetUserMunicipalityId();
                var statistics = await _municipalityAdminService.GetHouseholdStatisticsAsync(municipalityId);
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting household statistics for municipality admin");
                return StatusCode(500, new { message = "An error occurred while retrieving household statistics" });
            }
        }

        [HttpGet("residents/statistics")]
        public async Task<ActionResult<ResidentStatisticsDto>> GetResidentStatistics()
        {
            try
            {
                var municipalityId = GetUserMunicipalityId();
                var statistics = await _municipalityAdminService.GetResidentStatisticsAsync(municipalityId);
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting resident statistics for municipality admin");
                return StatusCode(500, new { message = "An error occurred while retrieving resident statistics" });
            }
        }

        [HttpGet("reports")]
        public async Task<ActionResult<MunicipalityReportDto>> GenerateReport()
        {
            try
            {
                var municipalityId = GetUserMunicipalityId();
                var report = await _municipalityAdminService.GenerateMunicipalityReportAsync(municipalityId);
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating report for municipality admin");
                return StatusCode(500, new { message = "An error occurred while generating the report" });
            }
        }



        [HttpGet("admins")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAdmins()
        {
            try
            {
                var municipalityId = GetUserMunicipalityId();
                var admins = await _municipalityAdminService.GetAdminsByMunicipalityAsync(municipalityId);
                return Ok(admins);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admins for municipality");
                return StatusCode(500, new { message = "An error occurred while retrieving admins" });
            }
        }



        private int GetUserMunicipalityId()
        {
            var municipalityIdClaim = User.FindFirst("MunicipalityId")?.Value;
            if (string.IsNullOrEmpty(municipalityIdClaim))
            {
                throw new UnauthorizedAccessException("MunicipalityId claim is missing");
            }
            return int.Parse(municipalityIdClaim);
        }
    }
}