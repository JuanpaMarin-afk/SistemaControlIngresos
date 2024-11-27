using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SistemaControlIngresos.Models;
using System.Xml.Linq;

namespace SistemaControlIngresos.Data
{
    public class TypeClientCbContext : DbContext
    {

        public TypeClientCbContext(DbContextOptions<TypeClientCbContext> options) : base(options)
        {
        }

        public DbSet<ClientType> ClientType { get; set; }

        public async Task<List<ClientType>> GetAllTypeClientAsync()
        {
            return await ClientType.FromSqlRaw("CALL SelectAllType()").ToListAsync();
        }

        public async Task<List<ClientType>> GetByIdTypeClientAsync(string id)
        {
            return await ClientType.FromSqlRaw("CALL SelectByIdType(@Id)", new MySqlParameter("@Id", id)).ToListAsync();
        }

        public async Task<bool> InsertTypeClientAsync(string name)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
            "CALL InsertType(@Name, @Status);",
            new MySqlParameter("@Name", name),
            new MySqlParameter("@Status", "Active")
        );

            
            return affectedRows > 0;
        }

        public async Task<bool> UpdateTypeClientAsync(int id, string name, string status)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
                "CALL UpdateType(@Id, @Name, @Status)",
                new MySqlParameter("@Id", id),
                new MySqlParameter("@Name", name),
                new MySqlParameter("@Status", status)
        );

            
            return affectedRows > 0;
        }

        public async Task<bool> ToggleTypeClientStatusAsync(int id)
        {

            var affectedRows = await Database.ExecuteSqlRawAsync(
            "CALL ToggleTypeStatus(@Id);",
            new MySqlParameter("@Id", id)
        );

            
            return affectedRows > 0;
        }

    }
}
