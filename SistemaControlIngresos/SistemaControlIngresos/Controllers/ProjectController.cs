using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SistemaControlIngresos.Data;
using SistemaControlIngresos.Models;
using System.Net.Sockets;

namespace SistemaControlIngresos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly ProjectDbContext _context;

        public ProjectController(ProjectDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllProjectAsync")]
        public async Task<ActionResult<List<ClientType>>> GetAllProjectAsync()
        {
            var attendants = await _context.GetAllProjectAsync();
            return Ok(attendants);
        }

        [HttpGet("GetByIdProjectAsync")]
        public async Task<ActionResult<Project>> GetByIdProjectAsync(string id)
        {
            var projects = await _context.GetByIdProjectAsync(id);

            if (projects == null || projects.Count == 0)
            {
                return Ok("¡Proyecto no encontrado!");
            }

            return projects[0];
        }

        [HttpPost("InsertProjectAsync")]
        public async Task<IActionResult> InsertProjectAsync(Project project)
        {
            var paymentEstimation = project.payment_estimation ?? DateTime.MinValue; // Asignar una fecha por defecto si es null
            var dateAprobation = project.date_aprobation ?? DateTime.MinValue;
            var dateBegin = project.date_begin ?? DateTime.MinValue;
            var dateEnd = project.date_end ?? DateTime.MinValue;
            var official_visit = project.official_visit ?? "N/A";
            var notes = project.notes ?? "N/A";


            var result = await _context.InsertProjectAsync(
                project.id_client,
                project.id_attendant,
                project.id_typework,
                project.contract_mount,
                project.type_mount,
                project.project_year,
                project.audit_year,
                project.hours,
                paymentEstimation,
                dateAprobation,
                dateBegin,
                dateEnd,
                official_visit,
                notes
            );

            return Ok(new { result = result });
        }

        [HttpPut("UpdateProjectAsync")]
        public async Task<IActionResult> UpdateProjectAsync(Project project)
        {
            var paymentEstimation = project.payment_estimation ?? DateTime.MinValue; // Asignar una fecha por defecto si es null
            var dateAprobation = project.date_aprobation ?? DateTime.MinValue;
            var dateBegin = project.date_begin ?? DateTime.MinValue;
            var dateEnd = project.date_end ?? DateTime.MinValue;
            var official_visit = project.official_visit ?? "N/A";
            var notes = project.notes ?? "N/A";

            var result = await _context.UpdateProjectAsync(
                project.id_project,
                project.id_client,
                project.id_attendant,
                project.id_typework,
                project.contract_mount,
                project.type_mount,
                project.project_year,
                project.audit_year,
                project.hours,
                paymentEstimation,
                dateAprobation,
                dateBegin,
                dateEnd,
                official_visit,
                notes
            );

            return Ok(new { result = result });
        }
    }
}
