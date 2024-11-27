using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaControlIngresos.Data;
using SistemaControlIngresos.Models;

namespace SistemaControlIngresos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        private readonly LogDbContext _context;

        public LogsController(LogDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllLogs")]
        public async Task<ActionResult<List<Logs>>> GetAllLogs()
        {
            var logs = await _context.GetAllLogs();
            return Ok(logs);
        }

        [HttpPost("InsertLogAsync")]
        public async Task<IActionResult> InsertLogAsync(Logs log)
        {
            var result = await _context.InsertLogAsync(log.description, log.user
                , log.date);
            return Ok(new { result = result });
        }
    }
}
