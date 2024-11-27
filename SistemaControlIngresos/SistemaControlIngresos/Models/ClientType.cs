using System.ComponentModel.DataAnnotations;

namespace SistemaControlIngresos.Models
{
    public class ClientType
    {
        [Key]
        public int id_type { get; set; }
        public string name { get; set; }
        public string status { get; set; }
    }
}
