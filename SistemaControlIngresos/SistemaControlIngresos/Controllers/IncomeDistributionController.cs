using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SistemaControlIngresos.Data;
using SistemaControlIngresos.Models;

namespace SistemaControlIngresos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncomeDistributionController : ControllerBase
    {
        private readonly IncomeDistributionDbContext _context;

        public IncomeDistributionController(IncomeDistributionDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllIncomes")]
        public async Task<ActionResult<List<IncomeDistribution>>> GetAllIncomes()
        {
            var earnings = await _context.GetAllIncomes();
            return Ok(earnings);
        }

        [HttpPost("AddIncome")]
        public async Task<IActionResult> AddIncome(IncomeDistribution i)
        {
            var result = await _context.AddIncome(i.estimatedamount, i.estimatedamountperhour, i.datemonth, i.remarks, "No Pagado", i.projectid);
            return Ok(new { result = result });
        }

        [HttpPut("UpdateIncome")]
        public async Task<IActionResult> UpdateIncome(IncomeDistribution i)
        {
            var result = await _context.UpdateIncome(i.incomeid, i.estimatedamount, i.estimatedamountperhour, i.datemonth, i.remarks, i.status, i.projectid);
            return Ok(new { result = result });
        }

        [HttpDelete("DeleteIncome/{incomeID}")]
        public async Task<IActionResult> DeleteIncome(int incomeID)
        {
            var result = await _context.DeleteIncome(incomeID);
            return Ok(new { result = result });
        }

        [HttpPut("UpdateDateForUnpaidIncome")]
        public async Task<IActionResult> UpdateDateForUnpaidIncome(IncomeDistribution i)
        {
            var result = await _context.UpdateDateForUnpaidIncome();
            return Ok(new { result = result });
        }
    }

}

