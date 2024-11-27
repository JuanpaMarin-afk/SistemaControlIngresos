using System.ComponentModel.DataAnnotations;

namespace SistemaControlIngresos.Models
{
    public class IncomeDistribution
    {
        [Key]
        public int incomeid { get; set; }
        public decimal estimatedamount { get; set; }
        public decimal estimatedamountperhour { get; set; }
        public DateTime datemonth { get; set; }
        public string remarks { get; set; }
        public string status { get; set; }
        public int projectid { get; set; }
    }
}
