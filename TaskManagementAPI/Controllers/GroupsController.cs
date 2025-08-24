using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagementAPI.Data;
using TaskManagementAPI.Models;
using TaskManagementAPI.DTOs;

namespace TaskManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroupsController : ControllerBase
    {
        private readonly TaskManagementContext _context;

        public GroupsController(TaskManagementContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<GroupDto>> CreateGroup(CreateGroupDto createGroupDto)
        {
            var group = new Group
            {
                Name = createGroupDto.Name,
                Description = createGroupDto.Description,
                OwnerId = createGroupDto.OwnerId,
                CreatedDate = DateTime.UtcNow
            };

            _context.Groups.Add(group);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGroup), new { id = group.Id }, group);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroupDto>>> GetGroup()
        {
            var tasks = await _context.Groups
                .Select(t => new GroupDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    OwnerId = t.OwnerId,
                    OwnerName = t.Owner.Name,
                    CreatedDate = t.CreatedDate
                })
                .ToListAsync();

            return Ok(tasks);
        }
    }
}