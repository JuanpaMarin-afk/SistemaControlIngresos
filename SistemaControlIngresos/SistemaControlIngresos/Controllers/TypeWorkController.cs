using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SistemaControlIngresos.Data;
using SistemaControlIngresos.Models;

namespace SistemaControlIngresos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypeWorkController : ControllerBase
    {
        private readonly TypeWorkDbContext _context;

        public TypeWorkController(TypeWorkDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllTypeWorkAsync")]
        public async Task<ActionResult<List<TypeWork>>> GetAllTypeWorkAsync()
        {
            var typeswork = await _context.GetAllTypeWorkAsync();
            return Ok(typeswork);
        }

        [HttpGet("GetByIdTypeWorkAsync")]
        public async Task<ActionResult<TypeWork>> GetByIdTypeWorkAsync(string id)
        {
            var typeswork = await _context.GetByIdTypeWorkAsync(id);

            if (typeswork == null || typeswork.Count == 0)
            {
                return Ok("¡Tipo de Trabajo no encontrado!");
            }

            return typeswork[0];
        }

        [HttpPost("InsertTypeWorkAsync")]
        public async Task<IActionResult> InsertTypeWorkAsync(TypeWork typeswork)
        {
            var result = await _context.InsertTypeWorkAsync(typeswork.name);
            return Ok(new { result = result });
        }

        [HttpPut("UpdateTypeWorkAsync")]
        public async Task<IActionResult> UpdateTypeWorkAsync(TypeWork typeswork)
        {
            var result = await _context.UpdateTypeWorkAsync(typeswork.id_type_work, typeswork.name, typeswork.status);
            return Ok(new { result = result });
        }

        [HttpPut("ToggleTypeWorkStatusAsync")]
        public async Task<IActionResult> ToggleTypeWorkStatusAsync(TypeWork typeswork)
        {
            var result = await _context.ToggleTypeWorkStatusAsync(typeswork.id_type_work);
            return Ok(new { result = result });
        }

    }
}
