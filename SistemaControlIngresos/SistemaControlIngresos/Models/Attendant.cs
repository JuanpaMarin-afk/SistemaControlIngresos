using System.ComponentModel.DataAnnotations;

namespace SistemaControlIngresos.Models
{
    public class Attendant
    {
        [Key]
        public int id_attendant { get; set; }
        public string name { get; set; }
        public string status { get; set; }
    }
}
