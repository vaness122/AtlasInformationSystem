using Microsoft.AspNetCore.Mvc;

namespace Atlas.API.Controllers
{
    public class MunicipalityController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
