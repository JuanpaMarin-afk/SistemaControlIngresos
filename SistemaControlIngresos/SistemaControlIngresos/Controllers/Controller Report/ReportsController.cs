using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaControlIngresos.Data;
using SistemaControlIngresos.Data.Db_Context_Reports;
using SistemaControlIngresos.Models;
using SistemaControlIngresos.Models.Model_Reports;

namespace SistemaControlIngresos.Controllers.Controller_Report
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ReportsDbContext _context;

        public ReportsController(ReportsDbContext context)
        {
            _context = context;
        }

        [HttpGet("ReportGetProjectReportByMonth")]
        public async Task<ActionResult<ProjectReportByMonth>> ReportGetProjectReportByMonth(DateTime p_start_date, DateTime p_end_date)
        {
            var reports = await _context.ReportGetProjectReportByMonth(p_start_date, p_end_date);
            return Ok(reports);
        }

        [HttpGet("ReportGetProjectReportByStatus")]
        public async Task<ActionResult<ProjectReportByStatus>> ReportGetProjectReportByStatus(bool p_is_facturado, int p_year)
        {
            var reports = await _context.ReportGetProjectReportByStatus(p_is_facturado,p_year);
            return Ok(reports);
        }

        [HttpGet("ReportGetTotalEarningsMinusAmount")]
        public async Task<ActionResult<TotalEarningsMinusAmount>> ReportGetTotalEarningsMinusAmount(int p_year, int p_client_id, DateTime p_start_date, DateTime p_end_date)
        {
            var reports = await _context.ReportGetTotalEarningsMinusAmount(p_year, p_client_id, p_start_date, p_end_date);
            return Ok(reports);
        }

        [HttpGet("ReportGetEarningsInColones")]
        public async Task<ActionResult<EarningsInColones>> ReportGetEarningsInColones(DateTime p_start_date, DateTime p_end_date)
        {
            var reports = await _context.ReportGetEarningsInColones(p_start_date, p_end_date);
            return Ok(reports);
        }

        [HttpGet("ReportGetEarningsInDollars")]
        public async Task<ActionResult<EarningsInDollars>> ReportGetEarningsInDollars(DateTime p_start_date, DateTime p_end_date)
        {
            var reports = await _context.ReportGetEarningsInDollars(p_start_date, p_end_date);
            return Ok(reports);
        }

        [HttpGet("ReportGetConsolidatedEarningsInColones")]
        public async Task<ActionResult<ConsolidatedEarningsInColones>> ReportGetConsolidatedEarningsInColones(DateTime p_start_date, DateTime p_end_date)
        {
            var reports = await _context.ReportGetConsolidatedEarningsInColones(p_start_date, p_end_date);
            return Ok(reports);
        }

        [HttpGet("ReportGetProjectReportByTypeWorkAndClient")]
        public async Task<ActionResult<ConsolidatedEarningsInColones>> ReportGetProjectReportByTypeWorkAndClient(int p_type_work_id, int p_client_id, DateTime p_start_date, DateTime p_end_date)
        {
            var reports = await _context.ReportGetProjectReportByTypeWorkAndClient(p_type_work_id, p_client_id, p_start_date, p_end_date);
            return Ok(reports);
        }

        [HttpGet("ReportControlClients")]
        public async Task<ActionResult<ReportControlClients>> ReportControlClients(int p_year, DateTime p_start_date, DateTime p_end_date)
        {
            var reports = await _context.ReportGetControlClients(p_year, p_start_date, p_end_date);
            return Ok(reports);
        }

        [HttpGet("ReportGetProjectReportByTypeSector")]
        public async Task<ActionResult<ReportByTypeSector>> ReportGetProjectReportByTypeSector(string p_type_sector, DateTime p_start_date, DateTime p_end_date)
        {
            var reports = await _context.ReportGetProjectReportByTypeSector(p_type_sector, p_start_date, p_end_date);
            return Ok(reports);
        }

        [HttpGet("GetAllIncomesReport")]
        public async Task<ActionResult<List<ReportIncomeDistribution>>> GetAllIncomesReport(DateTime p_start_date, DateTime p_end_date)
        {
            var report = await _context.GetAllIncomesReport(p_start_date, p_end_date);
            return Ok(report);
        }
    }
}
