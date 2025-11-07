using Atlas.Shared.DTOs;
using Atlas.BAL.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace Atlas.API.Controllers
{
    [ApiController]
    [Route("api/super-admin")]
    [Authorize(Roles = "SuperAdmin")]
    public class SuperAdminController : ControllerBase
    {
        private readonly ISuperAdmin _superAdminService;
        private readonly ILogger<SuperAdminController> _logger;

        public SuperAdminController(
            ISuperAdmin superAdminService,
            ILogger<SuperAdminController> logger)
        {
            _superAdminService = superAdminService;
            _logger = logger;
        }


        [HttpGet("overview")]
        public async Task<ActionResult<SystemOverviewDto>> GetSystemOverview()
        {
            try
            {
                var overview = await _superAdminService.GetSystemOverviewAsync();
                return Ok(overview);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system overview");
                return StatusCode(500, new { message = "An error occurred while retrieving system overview" });
            }
        }

        [HttpGet("statistics")]
        public async Task<ActionResult<SystemStatisticsDto>> GetSystemStatistics()
        {
            try
            {
                var statistics = await _superAdminService.GetSystemStatisticsAsync();
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system statistics");
                return StatusCode(500, new { message = "An error occurred while retrieving system statistics" });
            }
        }

        [HttpGet("municipalities/statistics")]
        public async Task<ActionResult<IEnumerable<MunicipalityStatisticsDto>>> GetMunicipalityStatistics()
        {
            try
            {
                var statistics = await _superAdminService.GetMunicipalityStatisticsAsync();
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting municipality statistics");
                return StatusCode(500, new { message = "An error occurred while retrieving municipality statistics" });
            }
        }


        [HttpGet("admins")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllAdmins()
        {
            try
            {
                var admins = await _superAdminService.GetAllAdminsAsync();
                return Ok(admins);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all admins");
                return StatusCode(500, new { message = "An error occurred while retrieving admins" });
            }
        }

        [HttpPost("admins/{id}/deactivate")]
        public async Task<ActionResult> DeactivateAdmin(string id)
        {
            try
            {
                var result = await _superAdminService.DeactivateAdminAsync(id);
                if (!result)
                    return NotFound(new { message = "Admin not found" });

                return Ok(new { message = "Admin deactivated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deactivating admin {AdminId}", id);
                return StatusCode(500, new { message = "An error occurred while deactivating admin" });
            }
        }

        [HttpPost("admins/{id}/reactivate")]
        public async Task<ActionResult> ReactivateAdmin(string id)
        {
            try
            {
                var result = await _superAdminService.ReactivateAdminAsync(id);
                if (!result)
                    return NotFound(new { message = "Admin not found" });

                return Ok(new { message = "Admin reactivated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reactivating admin {AdminId}", id);
                return StatusCode(500, new { message = "An error occurred while reactivating admin" });
            }
        }


        [HttpGet("municipalities")]
        public async Task<ActionResult<IEnumerable<MunicipalityDto>>> GetAllMunicipalities()
        {
            try
            {
                var municipalities = await _superAdminService.GetAllMunicipalitiesAsync();
                return Ok(municipalities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all municipalities");
                return StatusCode(500, new { message = "An error occurred while retrieving municipalities" });
            }
        }

        [HttpGet("municipalities/{id}")]
        public async Task<ActionResult<MunicipalityDto>> GetMunicipalityById(int id)
        {
            try
            {
                var municipality = await _superAdminService.GetMunicipalityByIdAsync(id);
                if (municipality == null)
                    return NotFound(new { message = "Municipality not found" });

                return Ok(municipality);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting municipality {MunicipalityId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the municipality" });
            }
        }

        [HttpPost("municipalities")]
        public async Task<ActionResult<MunicipalityDto>> CreateMunicipality(MunicipalityDto municipalityDto)
        {
            try
            {
                var municipality = await _superAdminService.CreateMunicipalityAsync(municipalityDto);
                return CreatedAtAction(nameof(GetMunicipalityById), new { id = municipality.Id }, municipality);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating municipality");
                return StatusCode(500, new { message = "An error occurred while creating the municipality" });
            }
        }

        [HttpPut("municipalities/{id}")]
        public async Task<ActionResult<MunicipalityDto>> UpdateMunicipality(int id, MunicipalityDto municipalityDto)
        {
            try
            {
                var municipality = await _superAdminService.UpdateMunicipalityAsync(id, municipalityDto);
                if (municipality == null)
                    return NotFound(new { message = "Municipality not found" });

                return Ok(municipality);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating municipality {MunicipalityId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the municipality" });
            }
        }

        [HttpDelete("municipalities/{id}")]
        public async Task<ActionResult> DeleteMunicipality(int id)
        {
            try
            {
                var result = await _superAdminService.DeleteMunicipalityAsync(id);
                if (!result)
                    return NotFound(new { message = "Municipality not found" });

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting municipality {MunicipalityId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the municipality" });
            }
        }

        [HttpGet("barangays")]
        public async Task<ActionResult<IEnumerable<BarangayDto>>> GetAllBarangays()
        {
            try
            {
                var barangays = await _superAdminService.GetAllBarangaysAsync();
                return Ok(barangays);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all barangays");
                return StatusCode(500, new { message = "An error occurred while retrieving barangays" });
            }
        }

        [HttpGet("barangays/{id}")]
        public async Task<ActionResult<BarangayDto>> GetBarangayById(int id)
        {
            try
            {
                var barangay = await _superAdminService.GetBarangayByIdAsync(id);
                if (barangay == null)
                    return NotFound(new { message = "Barangay not found" });

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
                var barangay = await _superAdminService.CreateBarangayAsync(barangayDto);
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
                var barangay = await _superAdminService.UpdateBarangayAsync(id, barangayDto);
                if (barangay == null)
                    return NotFound(new { message = "Barangay not found" });

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
                var result = await _superAdminService.DeleteBarangayAsync(id);
                if (!result)
                    return NotFound(new { message = "Barangay not found" });

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
        public async Task<ActionResult<IEnumerable<ZoneDto>>> GetAllZones()
        {
            try
            {
                var zones = await _superAdminService.GetAllZonesAsync();
                return Ok(zones);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all zones");
                return StatusCode(500, new { message = "An error occurred while retrieving zones" });
            }
        }

        [HttpGet("zones/{id}")]
        public async Task<ActionResult<ZoneDto>> GetZoneById(int id)
        {
            try
            {
                var zone = await _superAdminService.GetZoneByIdAsync(id);
                if (zone == null)
                    return NotFound(new { message = "Zone not found" });

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
                var zone = await _superAdminService.CreateZoneAsync(zoneDto);
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
                var zone = await _superAdminService.UpdateZoneAsync(id, zoneDto);
                if (zone == null)
                    return NotFound(new { message = "Zone not found" });

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
                var result = await _superAdminService.DeleteZoneAsync(id);
                if (!result)
                    return NotFound(new { message = "Zone not found" });

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
        public async Task<ActionResult<IEnumerable<HouseholdDto>>> GetAllHouseholds()
        {
            try
            {
                var households = await _superAdminService.GetAllHouseholdsAsync();
                return Ok(households);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all households");
                return StatusCode(500, new { message = "An error occurred while retrieving households" });
            }
        }

        [HttpGet("households/{id}")]
        public async Task<ActionResult<HouseholdDto>> GetHouseholdById(int id)
        {
            try
            {
                var household = await _superAdminService.GetHouseholdByIdAsync(id);
                if (household == null)
                    return NotFound(new { message = "Household not found" });

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
                var household = await _superAdminService.CreateHouseholdAsync(householdDto);
                return CreatedAtAction(nameof(GetHouseholdById), new { id = household.Id }, household);
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
                var household = await _superAdminService.UpdateHouseholdAsync(id, householdDto);
                if (household == null)
                    return NotFound(new { message = "Household not found" });

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
                var result = await _superAdminService.DeleteHouseholdAsync(id);
                if (!result)
                    return NotFound(new { message = "Household not found" });

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


        [HttpGet("residents")]
        public async Task<ActionResult<IEnumerable<ResidentDto>>> GetAllResidents()
        {
            try
            {
                var residents = await _superAdminService.GetAllResidentsAsync();
                return Ok(residents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all residents");
                return StatusCode(500, new { message = "An error occurred while retrieving residents" });
            }
        }

        [HttpGet("residents/{id}")]
        public async Task<ActionResult<ResidentDto>> GetResidentById(int id)
        {
            try
            {
                var resident = await _superAdminService.GetResidentByIdAsync(id);
                if (resident == null)
                    return NotFound(new { message = "Resident not found" });

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
                var resident = await _superAdminService.CreateResidentAsync(residentDto);
                return CreatedAtAction(nameof(GetResidentById), new { id = resident.Id }, resident);
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
                var resident = await _superAdminService.UpdateResidentAsync(id, residentDto);
                if (resident == null)
                    return NotFound(new { message = "Resident not found" });

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
                var result = await _superAdminService.DeleteResidentAsync(id);
                if (!result)
                    return NotFound(new { message = "Resident not found" });

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting resident {ResidentId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the resident" });
            }
        }
    }
}