using System.ComponentModel.DataAnnotations;

namespace SistemaControlIngresos.Models
{
    public class Logs
    {
        [Key]
        public int id_logs { get; set; }
        public string description { get; set; }
        public string user { get; set; }
        public string date { get; set; }
    }
}
