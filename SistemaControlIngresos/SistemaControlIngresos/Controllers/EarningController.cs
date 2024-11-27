using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SistemaControlIngresos.Data;
using SistemaControlIngresos.Models;

namespace SistemaControlIngresos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EarningController : ControllerBase
    {
        private readonly EarningDbContext _context;

        public EarningController(EarningDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetEarnings")]
        public async Task<ActionResult<List<Project>>> GetEarnings()
        {
            var earnings = await _context.GetEarnings();
            return Ok(earnings);
        }

        [HttpGet("GetEarningById")]
        public async Task<ActionResult<Earnings>> GetEarningById(string id)
        {
            var earnings = await _context.GetEarningById(id);

            if (earnings == null || earnings.Count == 0)
            {
                return Ok("¡Proyecto no encontrada!");
            }

            return earnings[0];
        }

        [HttpPost("InsertEarningAsync")]
        public async Task<IActionResult> InsertEarningAsync(Earnings e)
        {
            var result = await _context.InsertEarningAsync(e.id_transaction, e.type_mount, e.dolar_value, e.earning_mount, e.date_earning);
            return Ok(new { result = result });
        }

        [HttpPut("UpdateEarningAsync")]
        public async Task<IActionResult> UpdateEarningAsync(Earnings e)
        {
            var result = await _context.UpdateEarningAsync(e.id_earning, e.id_transaction, e.type_mount, e.dolar_value, e.earning_mount, e.date_earning);
            return Ok(new { result = result });
        }

        [HttpDelete("DeleteEarningAsync/{id_earning}")]
        public async Task<IActionResult> DeleteEarningAsync(int id_earning)
        {
            var result = await _context.DeleteEarningAsync(id_earning);
            return Ok(new { result = result });
        }
    }
}
