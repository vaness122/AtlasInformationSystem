using Atlas.Core.Models;
using Atlas.Core.Models.Residents;
using Atlas.DAL.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;

namespace Atlas.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResidentsController : Controller
    {
        private readonly IResidentRepository _residentRepository;
        private readonly IBarangayRepository _barangayRepository;
        private readonly IHouseholdRepository _householdRepository;
        private readonly IMunicipalityRepository _municipalityRepository;
        private readonly IZoneRepository _zoneRepository;
        public ResidentsController(IResidentRepository residentRepository, IBarangayRepository barangayRepository, IHouseholdRepository householdRepository, IMunicipalityRepository municipalityRepository, IZoneRepository zoneRepository)
        {
            _residentRepository = residentRepository;
            _barangayRepository = barangayRepository;
            _householdRepository = householdRepository;
            _municipalityRepository = municipalityRepository;
            _zoneRepository = zoneRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Resident>>> GetResidents()
        {
            var residents = await _residentRepository.GetAllAsync();
            return Ok(residents);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Resident>> GetResident(int id)
        {
            var resident = await _residentRepository.GetByIdAsync(id);
            if (resident == null)
                return NotFound();

            return Ok(resident);
        }

        [HttpPost]
        public async Task<ActionResult<Resident>> CreateResident(Resident resident)
        {
            await _residentRepository.AddAsync(resident);
            return CreatedAtAction(nameof(GetResident), new { id = resident.Id }, resident);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateResident(int id, Resident resident)
        {
            if (id != resident.Id)
                return BadRequest();

            var existing = await _residentRepository.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            await _residentRepository.UpdateAsync(resident);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteResident(int id)
        {
            var existing = await _residentRepository.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            await _residentRepository.DeleteAsync(id);
            return NoContent();
        }


        // ============================================
        // ** Barangay CRUD Operations **
        // ============================================

        [HttpGet("barangays")]
        public async Task<ActionResult<IEnumerable<Barangay>>> GetBarangays()
        {
            var barangays = await _barangayRepository.GetAllAsync();
            return Ok(barangays);
        }

        [HttpGet("barangays/{id}")]
        public async Task<ActionResult<Barangay>> GetBarangay(int id)
        {
            var barangay = await _barangayRepository.GetByIdAsync(id);
            if (barangay == null)
            {
                return NotFound();
            }
            return Ok(barangay);
        }

        [HttpPost("barangay")]
        public async Task<ActionResult> CreateBarangay(Barangay barangay)
        {
            await _barangayRepository.AddAsync(barangay);
            return CreatedAtAction(nameof(GetBarangay), new { id = barangay.Id }, barangay);
        }

        [HttpPut("barangay/{id}")]
        public async Task<ActionResult> UpdateBarangay(int id, Barangay barangay)
        {
            if (id != barangay.Id)
            {
                return BadRequest();
            }
            var existingBarangay = await _barangayRepository.GetByIdAsync(id);
            if (existingBarangay == null)
            {
                return NotFound();
            }
            await _barangayRepository.UpdateAsync(barangay);
            return NoContent();
        }

        [HttpDelete("barangay/{id}")]
        public async Task<ActionResult> DeleteBarangay(int id)
        {
            var existingBarangay = await _barangayRepository.GetByIdAsync(id);
            if (existingBarangay == null)
            {
                return NotFound();
            }
            await _barangayRepository.DeleteAsync(id);
            return NoContent();
        }

        // ============================================
        // ** Household CRUD Operations **
        // ============================================
        [HttpGet("household")]
        public async Task<ActionResult<IEnumerable<Household>>> GetHouseholds()
        {
            var households = await _householdRepository.GetAllAsync();
            return Ok(households);
        }

        [HttpGet("household/{id}")]
        public async Task<ActionResult<Household>> GetHousehold(int id)
        {
            var household = await _householdRepository.GetByIdAsync(id);
            if (household == null)
            {
                return NotFound();
            }
            return Ok(household);
        }

        [HttpPost("household")]
        public async Task<ActionResult<Household>> CreateHousehold(Household household)
        {
            await _householdRepository.AddAsync(household);
            return CreatedAtAction(nameof(GetHousehold), new { id = household.Id }, household);
        }

        [HttpPut("household/{id}")]
        public async Task<ActionResult> UpdateHousehold(int id, Household household)
        {
            if (id != household.Id)
            {
                return BadRequest();
            }

            var existingHousehold = await _householdRepository.GetByIdAsync(id);
            if (existingHousehold == null)
            {
                return NotFound();
            }

            await _householdRepository.UpdateAsync(household);
            return NoContent();
        }

        [HttpDelete("household/{id}")]
        public async Task<ActionResult> DeleteHousehold(int id)
        {
            var existingHousehold = await _householdRepository.GetByIdAsync(id);
            if (existingHousehold == null)
            {
                return NotFound();
            }

            await _householdRepository.DeleteAsync(id);
            return NoContent();
        }

        // ============================================
        // ** Household CRUD Operations **
        // ============================================

        [HttpGet("municipality")]
        public async Task<ActionResult<IEnumerable<Municipality>>> GetMunicipalities()
        {
            var municipalities = await _municipalityRepository.GetAllAsync();
            return Ok(municipalities);

        }
        [HttpGet("municipality/{id}")]
        public async Task<ActionResult<Municipality>> GetMunicipality(int id)
        {
            var municipality = await _municipalityRepository.GetByIdAsync(id);
            if (municipality == null)
            {
                return NotFound();
            }
            return Ok(municipality);
        }
        [HttpPost("municipality")]
        public async Task<ActionResult> CreateMunicipality(Municipality municipality)
        {
            await _municipalityRepository.AddAsync(municipality);
            return CreatedAtAction(nameof(GetMunicipality), new { id = municipality.Id }, municipality);
        }


        [HttpPut("municipality/{id}")]
        public async Task<ActionResult> UpdateMunicipality(int id, Municipality municipality)
        {
            if (id != municipality.Id)
            {
                return BadRequest();
            }
            var existingMunicipality = await _municipalityRepository.GetByIdAsync(id);
            if (existingMunicipality == null)
            {
                return NotFound();
            }
            await _municipalityRepository.UpdateAsync(municipality);
            return NoContent();
        }

        [HttpDelete("municipality/{id}")]
        public async Task<ActionResult> DeleteMunicipality(int id)
        {
            var existingMunicipality = await _municipalityRepository.GetByIdAsync(id);
            if (existingMunicipality == null)
            {
                return NotFound();
            }
            await _municipalityRepository.DeleteAsync(id);
            return NoContent();
        }

        // ============================================
        // ** Household CRUD Operations **
        // ============================================


        [HttpGet("zone")]
        public async Task<ActionResult<IEnumerable<Zone>>> GetZones()
        {
            var zones = await _zoneRepository.GetAllAsync();
            return Ok(zones);
        }

        [HttpGet("zone/{id}")]
        public async Task<ActionResult<Zone>> GetZone(int id)
        {
            var zone = await _zoneRepository.GetByIdAsync(id);
            if (zone == null)
            {
                return NotFound();
            }
            return Ok(zone);
        }

        [HttpPost("zone")]
        public async Task<ActionResult> CreateZone(Zone zone)
        {
            await _zoneRepository.AddAsync(zone);
            return CreatedAtAction(nameof(GetZone), new { id = zone.Id }, zone);
        }

        [HttpPut("zone/{id}")]
        public async Task<ActionResult> UpdateZone(int id, Zone zone)
        {
            if (id != zone.Id)
            {
                return BadRequest();
            }
            var existingZone = await _zoneRepository.GetByIdAsync(id);
            if (existingZone == null)
            {
                return NotFound();
            }
            await _zoneRepository.UpdateAsync(zone);
            return NoContent();
        }

        [HttpDelete("zone/{id}")]
        public async Task<ActionResult> DeleteZone(int id)
        {
            var existingZone = await _zoneRepository.GetByIdAsync(id);
            if (existingZone == null)
            {
                return NotFound();
            }
            await _zoneRepository.DeleteAsync(id);
            return NoContent();

        }
    }

}
