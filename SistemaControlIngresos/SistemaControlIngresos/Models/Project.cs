using System.ComponentModel.DataAnnotations;

namespace SistemaControlIngresos.Models
{
    public class Project
    {
        [Key]
        public int id_project { get; set; }
        public int id_client { get; set; }
        public string client_name { get; set; }
        public int id_attendant { get; set; }
        public string attendant_name { get; set; }
        public int id_typework { get; set; }
        public string type_work_name { get; set; }
        public decimal contract_mount { get; set; }
        public string type_mount { get; set; }
        public string project_year { get; set; }
        public string audit_year { get; set; }
        public string hours { get; set; }
        public DateTime? payment_estimation { get; set; }
        public DateTime? date_aprobation { get; set; }
        public DateTime? date_begin { get; set; }
        public DateTime? date_end { get; set; }
        public string? official_visit { get; set; }
        public string? notes { get; set; }
        public int? project_number { get; set; }
    }
}
