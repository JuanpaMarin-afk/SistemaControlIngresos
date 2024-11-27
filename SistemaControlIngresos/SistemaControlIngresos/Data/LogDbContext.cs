using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SistemaControlIngresos.Models;
using System.Xml.Linq;

namespace SistemaControlIngresos.Data
{
    public class LogDbContext : DbContext
    {
        public LogDbContext(DbContextOptions<LogDbContext> options) : base(options)
        {
        }

        public DbSet<Logs> Logs { get; set; }

        public async Task<List<Logs>> GetAllLogs()
        {
            return await Logs.FromSqlRaw("CALL SelectAllLogs()").ToListAsync();
        }

        public async Task<bool> InsertLogAsync(string description, string user, string date)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
            "CALL InsertLog(@Description, @User, @Date);",
            new MySqlParameter("@Description", description),
            new MySqlParameter("@User", user),
            new MySqlParameter("@Date", date)
        );


            return affectedRows > 0;
        }

    }
}
