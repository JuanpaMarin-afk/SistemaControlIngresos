using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SistemaControlIngresos.Data;
using SistemaControlIngresos.Models;

namespace SistemaControlIngresos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypeClientController : ControllerBase
    {
        private readonly TypeClientCbContext _context;

        public TypeClientController(TypeClientCbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllTypeClient")]
        public async Task<ActionResult<List<ClientType>>> GetAllAttendants()
        {
            var clientTypes = await _context.GetAllTypeClientAsync();
            return Ok(clientTypes);
        }

        [HttpGet("GetByIdTypeClientAsync")]
        public async Task<ActionResult<ClientType>> GetByIdTypeClientAsync(string id)
        {
            var clientTypes = await _context.GetByIdTypeClientAsync(id);

            if (clientTypes == null || clientTypes.Count == 0)
            {
                return Ok("¡Tipo de Cliente no encontrado!");
            }

            return clientTypes[0];
        }

        [HttpPost("InsertTypeClientAsync")]
        public async Task<IActionResult> InsertTypeClientAsync(ClientType clientType)
        {
            var result = await _context.InsertTypeClientAsync(clientType.name);
            return Ok(new { result = result });
        }

        [HttpPut("UpdateTypeClientAsync")]
        public async Task<IActionResult> UpdateTypeClientAsync(ClientType clientType)
        {
            var result = await _context.UpdateTypeClientAsync(clientType.id_type, clientType.name, clientType.status);
            return Ok(new { result = result });
        }

        [HttpPut("ToggleTypeClientStatusAsync")]
        public async Task<IActionResult> ToggleTypeClientStatusAsync(ClientType clientType)
        {
            var result = await _context.ToggleTypeClientStatusAsync(clientType.id_type);
            return Ok(new { result = result });
        }
    }
}
