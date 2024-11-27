using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SistemaControlIngresos.Models;
using System.Xml.Linq;

namespace SistemaControlIngresos.Data
{
    public class IncomeDistributionDbContext : DbContext
    {
        public IncomeDistributionDbContext(DbContextOptions<IncomeDistributionDbContext> options) : base(options)
        {
        }

        public DbSet<IncomeDistribution> IncomeDistribution { get; set; }

        public async Task<List<IncomeDistribution>> GetAllIncomes()
        {
            return await IncomeDistribution.FromSqlRaw("CALL GetAllIncomes()").ToListAsync();
        }

        public async Task<bool> AddIncome(decimal estimatedAmount, decimal estimatedAmountPerHour,
            DateTime dateMonth, string remarks, string status, int projectId)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
            "CALL AddIncome(@_EstimatedAmount, @_EstimatedAmountPerHour, @_DateMonth, @_Remarks, @_Status, @_ProjectID);",
            new MySqlParameter("@_EstimatedAmount", estimatedAmount),
            new MySqlParameter("@_EstimatedAmountPerHour", estimatedAmountPerHour),
            new MySqlParameter("@_DateMonth", dateMonth),
            new MySqlParameter("@_Remarks", remarks),
            new MySqlParameter("@_Status", status),
            new MySqlParameter("@_ProjectID", projectId)
        );
            return affectedRows > 0;
        }
            
        public async Task<bool> UpdateIncome(int incomeID, decimal estimatedAmount, decimal estimatedAmountPerHour,
            DateTime dateMonth, string remarks, string status, int projectId)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
            "CALL UpdateIncome(@_IncomeID, @_EstimatedAmount, @_EstimatedAmountPerHour, @_DateMonth, @_Remarks, @_Status, @_ProjectID);",
            new MySqlParameter("@_IncomeID", incomeID),
            new MySqlParameter("@_EstimatedAmount", estimatedAmount),
            new MySqlParameter("@_EstimatedAmountPerHour", estimatedAmountPerHour),
            new MySqlParameter("@_DateMonth", dateMonth),
            new MySqlParameter("@_Remarks", remarks),
            new MySqlParameter("@_Status", status),
            new MySqlParameter("@_ProjectID", projectId)
        );
            return affectedRows > 0;
        }

        public async Task<bool> DeleteIncome(int incomeID)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
                "CALL DeleteIncome(@_IncomeID);",
                new MySqlParameter("@_IncomeID", incomeID)
            );

            return affectedRows > 0;
        }

        public async Task<bool> UpdateDateForUnpaidIncome()
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
            "CALL UpdateDateForUnpaidIncome();"
        );
            return affectedRows > 0;
        }

    }
}
