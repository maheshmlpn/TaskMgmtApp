using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagementAPI.Data;
using TaskManagementAPI.Models;
using TaskManagementAPI.DTOs;

namespace TaskManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly TaskManagementContext _context;

        public UsersController(TaskManagementContext context)
        {
            _context = context;
        }


        /// <summary>
        /// Create a new user. while creating user CreatedDate will be set to current datetime and Id will be auto generated. password is also required field.
        /// </summary>
        /// <param name="userDto"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser(UserDto userDto)
        {
            var user = new User
            {
                Name = userDto.Name,
                Role = userDto.Role,
                Email = userDto.Email,
                Password = userDto.Password,
                CreatedDate = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(CreateUser), new { id = user.Id }, user);
        }

        /// <summary>
        /// Get all users and no need to return password
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .Select(t => new UserDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Role = t.Role,
                    Email = t.Email,
                    CreatedDate = t.CreatedDate
                })
                .ToListAsync();

            return Ok(users);
        }
    }
}