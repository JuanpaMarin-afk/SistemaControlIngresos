using System.ComponentModel.DataAnnotations;

namespace SistemaControlIngresos.Models
{
    public class User
    {
        [Key]
        public int id_user { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        //public byte[]? encrypted_password { get; set; }
        public string job { get; set; }
        public string rol { get; set; }
        public string status { get; set; }
    }
}
