using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SistemaControlIngresos.Models;
using System.Xml.Linq;

namespace SistemaControlIngresos.Data
{
    public class AttendantDbContext : DbContext
    {
        public AttendantDbContext(DbContextOptions<AttendantDbContext> options) : base(options)
        {
        }

        public DbSet<Attendant> Attendant { get; set; }

        public async Task<List<Attendant>> GetAllAttendantAsync()
        {
            return await Attendant.FromSqlRaw("CALL SelectAllAttendant()").ToListAsync();
        }

        public async Task<List<Attendant>> GetByIdAttendantAsync(string id)
        {
            return await Attendant.FromSqlRaw("CALL SelectByIdAttendant(@Id)", new MySqlParameter("@Id", id)).ToListAsync();
        }

        public async Task<bool> InsertAttendantAsync(string name)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
            "CALL InsertAttendant(@Name, @Status);",
            new MySqlParameter("@Name", name),
            new MySqlParameter("@Status", "Active")
        );

            
            return affectedRows > 0;
        }

        public async Task<bool> UpdateAttendantAsync(int id, string name, string status)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
                "CALL UpdateAttendant(@Id, @Name, @Status)",
                new MySqlParameter("@Id", id),
                new MySqlParameter("@Name", name),
                new MySqlParameter("@Status", status)
        );

            
            return affectedRows > 0;
        }

        public async Task<bool> ToggleAttendantStatusAsync(int id)
        {

            var affectedRows = await Database.ExecuteSqlRawAsync(
            "CALL ToggleAttendantStatus(@Id);",
            new MySqlParameter("@Id", id)
        );

           
            return affectedRows > 0;
        }
    }
}
