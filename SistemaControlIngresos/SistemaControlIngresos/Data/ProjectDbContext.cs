using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SistemaControlIngresos.Models;
using System.Net.Sockets;

namespace SistemaControlIngresos.Data
{
    public class ProjectDbContext : DbContext
    {
        public ProjectDbContext(DbContextOptions<ProjectDbContext> options) : base(options)
        {
        }

        public DbSet<Project> Project { get; set; }

        public async Task<List<Project>> GetAllProjectAsync()
        {
            return await Project.FromSqlRaw("CALL GetProjects()").ToListAsync();
        }

        public async Task<List<Project>> GetByIdProjectAsync(string id)
        {
            return await Project.FromSqlRaw("CALL GetProjectById(@Id)", new MySqlParameter("@Id", id)).ToListAsync();
        }

        public async Task<bool> InsertProjectAsync(int id_Client, int id_Attendant, int id_Type_work, decimal contract_Mount, string type_Mount, string project_Year, string audit_Year, string hours, DateTime payment_estimation, DateTime date_aprobation, DateTime date_begin, DateTime date_end, string official_visit, string notes)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
                "CALL InsertProject(@p_id_client, @p_id_attendant, @p_id_typework, @p_contract_mount, @p_type_mount, @p_project_year, @p_audit_year, @p_hours, @p_payment_estimation, @p_date_aprobation, @p_date_begin, @p_date_end, @p_official_visit, @p_notes);",
                new MySqlParameter("@p_id_client", id_Client),
                new MySqlParameter("@p_id_attendant", id_Attendant),
                new MySqlParameter("@p_id_typework", id_Type_work),
                new MySqlParameter("@p_contract_mount", contract_Mount),
                new MySqlParameter("@p_type_mount", type_Mount),
                new MySqlParameter("@p_project_year", project_Year),
                new MySqlParameter("@p_audit_year", audit_Year),
                new MySqlParameter("@p_hours", hours),
                new MySqlParameter("@p_payment_estimation", payment_estimation),
                new MySqlParameter("@p_date_aprobation", date_aprobation),
                new MySqlParameter("@p_date_begin", date_begin),
                new MySqlParameter("@p_date_end", date_end),
                new MySqlParameter("@p_official_visit", official_visit),
                new MySqlParameter("@p_notes", notes)
            );

            return affectedRows > 0;
        }

        public async Task<bool> UpdateProjectAsync(int id_project, int id_Client, int id_Attendant, int id_Type_work, decimal contract_Mount, string type_Mount, string project_Year, string audit_Year, string hours, DateTime payment_estimation, DateTime date_aprobation, DateTime date_begin, DateTime date_end, string official_visit, string notes)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
                "CALL UpdateProject(@p_id_project, @p_id_client, @p_id_attendant, @p_id_typework, @p_contract_mount, @p_type_mount, @p_project_year, @p_audit_year, @p_hours, @p_payment_estimation, @p_date_aprobation, @p_date_begin, @p_date_end, @p_official_visit, @p_notes);",
                new MySqlParameter("@p_id_project", id_project),
                new MySqlParameter("@p_id_client", id_Client),
                new MySqlParameter("@p_id_attendant", id_Attendant),
                new MySqlParameter("@p_id_typework", id_Type_work),
                new MySqlParameter("@p_contract_mount", contract_Mount),
                new MySqlParameter("@p_type_mount", type_Mount),
                new MySqlParameter("@p_project_year", project_Year),
                new MySqlParameter("@p_audit_year", audit_Year),
                new MySqlParameter("@p_hours", hours),
                new MySqlParameter("@p_payment_estimation", payment_estimation),
                new MySqlParameter("@p_date_aprobation", date_aprobation),
                new MySqlParameter("@p_date_begin", date_begin),
                new MySqlParameter("@p_date_end", date_end),
                new MySqlParameter("@p_official_visit", official_visit),
                new MySqlParameter("@p_notes", notes)
            );

            return affectedRows > 0;
        }

    }
}
