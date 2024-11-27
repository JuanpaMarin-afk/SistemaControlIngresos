using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaControlIngresos.Data;
using SistemaControlIngresos.Models;
using System.Threading.Tasks;

namespace SistemaControlIngresos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserDbContext _context;

        public UserController(UserDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllUsers")]
        public async Task<ActionResult<List<User>>> GetAllUsers()
        {
            var users = await _context.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpPost("InsertUser")]
        public async Task<IActionResult> InsertUser(User user)
        {
            var result = await _context.InsertUserAsync(user.email, user.password, user.job, user.rol);
            return Ok(new { result = result });
        }

        [HttpPut("UpdateUserAsync")]
        public async Task<IActionResult> UpdateUserAsync(User user)
        {
            var result = await _context.UpdateUserAsync(user.id_user, user.email, user.password, user.job, user.rol, user.status);
            return Ok(new { result = result });
        }

        [HttpPost("VerifyUserPassword")]
        public async Task<IActionResult> VerifyUserPassword(User user)
        {
            var result = await _context.VerifyUserPasswordAsync(user.email, user.password);
            return Ok(new { result = result });
        }

        [HttpPut("ToggleUserStatus")]
        public async Task<IActionResult> ToggleUserStatus(User user)
        {
            var result = await _context.ToggleUserStatusAsync(user.id_user);
            return Ok(new { result = result });
        }

    }

}
