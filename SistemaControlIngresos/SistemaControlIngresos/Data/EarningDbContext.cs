using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SistemaControlIngresos.Models;
using System.Net.Sockets;

namespace SistemaControlIngresos.Data
{
    public class EarningDbContext : DbContext
    {
        public EarningDbContext(DbContextOptions<EarningDbContext> options) : base(options)
        {
        }

        public DbSet<Earnings> Earnings { get; set; }

        public async Task<List<Earnings>> GetEarnings()
        {
            return await Earnings.FromSqlRaw("CALL GetEarnings()").ToListAsync();
        }

        public async Task<List<Earnings>> GetEarningById(string id)
        {
            return await Earnings.FromSqlRaw("CALL GetEarningById(@Id)", new MySqlParameter("@Id", id)).ToListAsync();
        }

        public async Task<bool> InsertEarningAsync(int id_transaction, string p_type_mount, decimal p_dolar_value, decimal p_earning_mount, DateTime p_date_earning)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
                "CALL InsertEarning(@p_id_transaction, @p_type_mount, @p_dolar_value, @p_earning_mount, @p_date_earning);",
                new MySqlParameter("@p_id_transaction", id_transaction),
                new MySqlParameter("@p_type_mount", p_type_mount),
                new MySqlParameter("@p_dolar_value", p_dolar_value),
                new MySqlParameter("@p_earning_mount", p_earning_mount),
                new MySqlParameter("@p_date_earning", p_date_earning)
            );

            return affectedRows > 0;
        }

        public async Task<bool> UpdateEarningAsync(int p_id_earning, int id_transaction, string p_type_mount, decimal p_dolar_value, decimal p_earning_mount, DateTime p_date_earning)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
                "CALL UpdateEarning(@p_id_earning, @p_id_transaction, @p_type_mount, @p_dolar_value, @p_earning_mount, @p_date_earning);",
                new MySqlParameter("@p_id_earning", p_id_earning), 
                new MySqlParameter("@p_id_transaction", id_transaction),
                new MySqlParameter("@p_type_mount", p_type_mount),
                new MySqlParameter("@p_dolar_value", p_dolar_value),
                new MySqlParameter("@p_earning_mount", p_earning_mount),
                new MySqlParameter("@p_date_earning", p_date_earning)
            );

            return affectedRows > 0;
        }

        public async Task<bool> DeleteEarningAsync(int p_id_earning)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
                "CALL DeleteEarning(@p_id_earning);",
                new MySqlParameter("@p_id_earning", p_id_earning)
            );

            return affectedRows > 0;
        }
    }
}
