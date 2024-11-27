using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SistemaControlIngresos.Data;
using SistemaControlIngresos.Models;

namespace SistemaControlIngresos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly ClientDbContext _context;

        public ClientController(ClientDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllClientAsync")]
        public async Task<ActionResult<List<ClientType>>> GetAllClientAsync()
        {
            var clients = await _context.GetAllClientAsync();
            return Ok(clients);
        }

        [HttpGet("GetByIdClientAsync")]
        public async Task<ActionResult<Client>> GetByIdClientAsync(string id)
        {
            var clients = await _context.GetByIdClientAsync(id);

            if (clients == null || clients.Count == 0)
            {
                return Ok("¡Cliente no encontrado!");
            }

            return clients[0];
        }

        [HttpPost("InsertClientAsync")]
        public async Task<IActionResult> InsertClientAsync(Client client)
        {
            var result = await _context.InsertClientAsync(client.name, client.sector, client.legal_id, client.id_type);
            return Ok(new { result = result });
        }

        [HttpPut("UpdateClientAsync")]
        public async Task<IActionResult> UpdateClientAsync(Client client)
        {
            var result = await _context.UpdateClientAsync(client.id_client, client.name, client.sector, client.legal_id, client.id_type, client.status);
            return Ok(new { result = result });
        }

        [HttpPut("ToggleClientStatusAsync")]
        public async Task<IActionResult> ToggleClientStatusAsync(Client client)
        {
            var result = await _context.ToggleClientStatusAsync(client.id_client);
            return Ok(new { result = result });
        }
    }
}
