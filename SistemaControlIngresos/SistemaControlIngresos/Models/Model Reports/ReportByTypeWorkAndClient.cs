using System.ComponentModel.DataAnnotations;

namespace SistemaControlIngresos.Models.Model_Reports
{
    public class ReportByTypeWorkAndClient
    {
        [Key]
        public int ID_PROJECT { get; set; }
        public decimal CONTRACT_MOUNT { get; set; }
        public string TYPE_MOUNT { get; set; }
        public DateTime? DATE_APROBATION { get; set; }
        public DateTime? DATE_BEGIN { get; set; }
        public DateTime? DATE_END { get; set; }
        public string TYPE_WORK_NAME { get; set; }
        public string CLIENT_NAME { get; set; }
        public decimal? TOTAL_EARNINGS { get; set; }
        public DateTime? DATE_EARNING { get; set; }
        public string PAGADO { get; set; }
    }
}