using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SistemaControlIngresos.Models;

namespace SistemaControlIngresos.Data
{
    public class ClientDbContext : DbContext
    {
        public ClientDbContext(DbContextOptions<ClientDbContext> options) : base(options)
        {
        }

        public DbSet<Client> Client { get; set; }

        public async Task<List<Client>> GetAllClientAsync()
        {
            return await Client.FromSqlRaw("CALL SelectAllClients").ToListAsync();
        }

        public async Task<List<Client>> GetByIdClientAsync(string id)
        {
            return await Client.FromSqlRaw("CALL SelectByIdClient(@Id)", new MySqlParameter("@Id", id)).ToListAsync();
        }

        public async Task<bool> InsertClientAsync(string name, string sector, string legal_id, int type_id)
        {

            var affectedRows = await Database.ExecuteSqlRawAsync(
                "CALL InsertClient(@Name, @Sector, @Legal_Id, @Id_Type);",
                new MySqlParameter("@Name", name),
                new MySqlParameter("@Sector", sector),
                new MySqlParameter("@Legal_Id", legal_id),
                new MySqlParameter("@Id_Type", type_id)
            );
            
            return affectedRows > 0;
        }

        public async Task<bool> UpdateClientAsync(int id, string name, string sector, string legal_id, int type_id, string status)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
                "CALL UpdateClient(@Id, @Name, @Sector, @Legal_Id, @Id_Type, @Status);",
                new MySqlParameter("@Id", id),
                new MySqlParameter("@Name", name),
                new MySqlParameter("@Sector", sector),
                new MySqlParameter("@Legal_Id", legal_id),
                new MySqlParameter("@Id_Type", type_id),
                new MySqlParameter("@Status", status)
            );

            return affectedRows > 0;
        }

        public async Task<bool> ToggleClientStatusAsync(int id)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
                "CALL ToggleClientStatus(@Id)",
                new MySqlParameter("@Id", id)
            );

            return affectedRows > 0;
        }
    }
}
