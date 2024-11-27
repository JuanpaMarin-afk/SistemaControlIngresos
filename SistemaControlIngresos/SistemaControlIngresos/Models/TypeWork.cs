using System.ComponentModel.DataAnnotations;

namespace SistemaControlIngresos.Models
{
    public class TypeWork
    {
        [Key]
        public int id_type_work { get; set; }
        public string name { get; set; }
        public string status { get; set; }
    }
}
