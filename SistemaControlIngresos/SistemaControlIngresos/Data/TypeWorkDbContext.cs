using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SistemaControlIngresos.Models;
using System.Xml.Linq;

namespace SistemaControlIngresos.Data
{
    public class TypeWorkDbContext : DbContext
    {
        public TypeWorkDbContext(DbContextOptions<TypeWorkDbContext> options) : base(options)
        {
        }

        public DbSet<TypeWork> TypeWork { get; set; }

        public async Task<List<TypeWork>> GetAllTypeWorkAsync()
        {
            return await TypeWork.FromSqlRaw("CALL SelectAllTypeWork()").ToListAsync();
        }

        public async Task<List<TypeWork>> GetByIdTypeWorkAsync(string id)
        {
            return await TypeWork.FromSqlRaw("CALL SelectByIdTypeWork(@Id)", new MySqlParameter("@Id", id)).ToListAsync();
        }

        public async Task<bool> InsertTypeWorkAsync(string name)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
            "CALL InsertTypeWork(@Name, @Status);",
            new MySqlParameter("@Name", name),
            new MySqlParameter("@Status", "Active")
        );


            return affectedRows > 0;
        }

        public async Task<bool> UpdateTypeWorkAsync(int id, string name, string status)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
                "CALL UpdateTypeWork(@Id, @Name, @Status)",
                new MySqlParameter("@Id", id),
                new MySqlParameter("@Name", name),
                new MySqlParameter("@Status", status)
        );


            return affectedRows > 0;
        }

        public async Task<bool> ToggleTypeWorkStatusAsync(int id)
        {

            var affectedRows = await Database.ExecuteSqlRawAsync(
            "CALL ToggleTypeWorkStatus(@Id);",
            new MySqlParameter("@Id", id)
        );


            return affectedRows > 0;
        }

    }

}
