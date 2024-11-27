using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaControlIngresos.Data;
using SistemaControlIngresos.Models;

namespace SistemaControlIngresos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendantController : ControllerBase
    {
        private readonly AttendantDbContext _context;

        public AttendantController(AttendantDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllAttendants")]
        public async Task<ActionResult<List<Attendant>>> GetAllAttendants()
        {
            var attendants = await _context.GetAllAttendantAsync();
            return Ok(attendants);
        }

        [HttpGet("GetByIdAttendantAsync")]
        public async Task<ActionResult<Attendant>> GetByIdAttendantAsync(string id)
        {
            var attendants = await _context.GetByIdAttendantAsync(id);

            if (attendants == null || attendants.Count == 0)
            {
                return Ok("¡Encargado no encontrado!");
            }

            return attendants[0];
        }

        [HttpPost("InsertAttendantAsync")]
        public async Task<IActionResult> InsertAttendantAsync(Attendant attendant)
        {
            var result = await _context.InsertAttendantAsync(attendant.name);
            return Ok(new { result = result });
        }

        [HttpPut("UpdateAttendantAsync")]
        public async Task<IActionResult> UpdateAttendantAsync(Attendant attendant)
        {
            var result = await _context.UpdateAttendantAsync(attendant.id_attendant, attendant.name, attendant.status);
            return Ok(new { result = result });
        }

        [HttpPut("ToggleAttendantStatusAsync")]
        public async Task<IActionResult> ToggleAttendantStatusAsync(Attendant attendant)
        {
            var result = await _context.ToggleAttendantStatusAsync(attendant.id_attendant);
            return Ok(new { result = result });
        }

    }
}
