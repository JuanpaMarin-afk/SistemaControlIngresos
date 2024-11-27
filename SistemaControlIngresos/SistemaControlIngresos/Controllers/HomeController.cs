using Microsoft.AspNetCore.Mvc;

namespace SistemaControlIngresos.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
