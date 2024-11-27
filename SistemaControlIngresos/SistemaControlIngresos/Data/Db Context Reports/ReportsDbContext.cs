using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SistemaControlIngresos.Models;
using System.Xml.Linq;
using SistemaControlIngresos.Models.Model_Reports;

namespace SistemaControlIngresos.Data.Db_Context_Reports
{
    public class ReportsDbContext : DbContext
    {
        public ReportsDbContext(DbContextOptions<ReportsDbContext> options) : base(options)
        {
        }

        public DbSet<ProjectReportByMonth> ProjectReportByMonth { get; set; }
        public DbSet<ProjectReportByStatus> ProjectReportByStatus { get; set; }
        public DbSet<TotalEarningsMinusAmount> TotalEarningsMinusAmount { get; set; }
        public DbSet<ReportControlClients> ReportControlClients { get; set; }
        public DbSet<EarningsInColones> EarningsInColones { get; set; }
        public DbSet<EarningsInDollars> EarningsInDollars { get; set; }
        public DbSet<ConsolidatedEarningsInColones> ConsolidatedEarningsInColones { get; set; }
        public DbSet<ReportByTypeWorkAndClient> ReportByTypeWorkAndClient { get; set; }
        public DbSet<ReportByTypeSector> ReportByTypeSector { get; set; }
        public DbSet<ReportIncomeDistribution> ReportIncomeDistribution { get; set; }

        // Método OnModelCreating para configurar la entidad sin clave
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ReportControlClients>().HasNoKey();
            modelBuilder.Entity<TotalEarningsMinusAmount>().HasNoKey();
            modelBuilder.Entity<EarningsInColones>().HasNoKey();
            modelBuilder.Entity<EarningsInDollars>().HasNoKey();
            modelBuilder.Entity<ConsolidatedEarningsInColones>().HasNoKey();

            base.OnModelCreating(modelBuilder);
        }

        public async Task<List<ProjectReportByMonth>> ReportGetProjectReportByMonth(DateTime p_start_date, DateTime p_end_date)
        {
            return await ProjectReportByMonth.FromSqlRaw("CALL ReportGetProjectReportByMonth(@p_start_date, @p_end_date)", 
                new MySqlParameter("@p_start_date", p_start_date),
                new MySqlParameter("@p_end_date", p_end_date)).ToListAsync();
        }
        public async Task<List<ProjectReportByStatus>> ReportGetProjectReportByStatus(bool p_is_facturado, int p_year)
        {   
            return await ProjectReportByStatus.FromSqlRaw("CALL ReportGetProjectReportByStatus(@p_is_facturado, @p_year)",
                new MySqlParameter("@p_is_facturado", p_is_facturado),
                new MySqlParameter("@p_year", p_year)).ToListAsync();
        }
        public async Task<List<TotalEarningsMinusAmount>> ReportGetTotalEarningsMinusAmount(int p_year, int p_client_id, DateTime p_start_date, DateTime p_end_date)
        {
            return await TotalEarningsMinusAmount.FromSqlRaw("CALL ReportGetTotalEarningsMinusAmount(@p_year, @p_client_id , @p_start_date , @p_end_date)",
                new MySqlParameter("@p_year", p_year),
                new MySqlParameter("@p_client_id", p_client_id),
                new MySqlParameter("@p_start_date", p_start_date),
                new MySqlParameter("@p_end_date", p_end_date)).ToListAsync();
        }
        public async Task<List<EarningsInColones>> ReportGetEarningsInColones(DateTime p_start_date, DateTime p_end_date)
        {
            return await EarningsInColones.FromSqlRaw("CALL ReportGetEarningsInColones(@p_start_date, @p_end_date)",
                new MySqlParameter("@p_start_date", p_start_date),
                new MySqlParameter("@p_end_date", p_end_date)).ToListAsync();
        }
        public async Task<List<EarningsInDollars>> ReportGetEarningsInDollars(DateTime p_start_date, DateTime p_end_date)
        {
            return await EarningsInDollars.FromSqlRaw("CALL ReportGetEarningsInDollars(@p_start_date, @p_end_date)",
                new MySqlParameter("@p_start_date", p_start_date),
                new MySqlParameter("@p_end_date", p_end_date)).ToListAsync();
        }
        public async Task<List<ConsolidatedEarningsInColones>> ReportGetConsolidatedEarningsInColones(DateTime p_start_date, DateTime p_end_date)
        {
            return await ConsolidatedEarningsInColones.FromSqlRaw("CALL ReportGetConsolidatedEarningsInColones(@p_start_date, @p_end_date)",
                new MySqlParameter("@p_start_date", p_start_date),
                new MySqlParameter("@p_end_date", p_end_date)).ToListAsync();
        }

        public async Task<List<ReportByTypeWorkAndClient>> ReportGetProjectReportByTypeWorkAndClient(int p_type_work_id, int p_client_id, DateTime p_start_date, DateTime p_end_date)
        {
            return await ReportByTypeWorkAndClient.FromSqlRaw("CALL ReportGetProjectReportByTypeWorkAndClient(@p_type_work_id, @p_client_id, @p_start_date, @p_end_date)",
                new MySqlParameter("@p_type_work_id", p_type_work_id),
                new MySqlParameter("@p_client_id", p_client_id),
                new MySqlParameter("@p_start_date", p_start_date),
                new MySqlParameter("@p_end_date", p_end_date)).ToListAsync();
        }

        public async Task<List<ReportControlClients>> ReportGetControlClients(int p_year, DateTime p_start_date, DateTime p_end_date)
        {
            return await ReportControlClients.FromSqlRaw("CALL ReportGetControlClients(@p_year, @p_start_date, @p_end_date)",
                new MySqlParameter("@p_year", p_year),
                new MySqlParameter("@p_start_date", p_start_date),
                new MySqlParameter("@p_end_date", p_end_date)).ToListAsync();
        }

        public async Task<List<ReportByTypeSector>> ReportGetProjectReportByTypeSector(string p_type_sector, DateTime p_start_date, DateTime p_end_date)
        {
            return await ReportByTypeSector.FromSqlRaw("CALL ReportGetProjectReportByTypeSector(@p_type_sector, @p_start_date, @p_end_date)",
                new MySqlParameter("@p_type_sector", p_type_sector),
                new MySqlParameter("@p_start_date", p_start_date),
                new MySqlParameter("@p_end_date", p_end_date)).ToListAsync();
        }

        public async Task<List<ReportIncomeDistribution>> GetAllIncomesReport(DateTime p_start_date, DateTime p_end_date)
        {
            return await ReportIncomeDistribution.FromSqlRaw("CALL GetAllIncomesReport(@p_start_date, @p_end_date)",
                new MySqlParameter("@p_start_date", p_start_date),
                new MySqlParameter("@p_end_date", p_end_date)).ToListAsync();
        }
    }
}
