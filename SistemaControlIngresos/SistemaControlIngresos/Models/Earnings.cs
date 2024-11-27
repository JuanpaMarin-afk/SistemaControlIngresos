using System.ComponentModel.DataAnnotations;

namespace SistemaControlIngresos.Models
{
    public class Earnings
    {
        [Key]
        public int id_earning { get; set; }
        public int id_transaction { get; set; }
        public string type_mount { get; set; }
        public decimal dolar_value { get; set; }
        public decimal earning_mount { get; set; }
        public DateTime date_earning { get; set; }
    }
}
