using Microsoft.AspNetCore.Mvc;

namespace Atlas.API.Controllers
{
    public class BarangayController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
