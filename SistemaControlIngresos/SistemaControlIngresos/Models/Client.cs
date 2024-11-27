using System.ComponentModel.DataAnnotations;

namespace SistemaControlIngresos.Models
{
    public class Client
    {
        [Key]
        public int id_client { get; set; }
        public string name { get; set; }
        public string sector { get; set; }
        public string legal_id { get; set; }
        public int id_type { get; set; }
        public string name_type { get; set; }
        public string status { get; set; }
    }
}
