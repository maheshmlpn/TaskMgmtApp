using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagementAPI.Data;
using TaskManagementAPI.Models;
using TaskManagementAPI.DTOs;

namespace TaskManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskManagementContext _context;

        public TasksController(TaskManagementContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks()
        {
            var tasks = await _context.Tasks
                .Include(t => t.CreatedBy)
                .Include(t => t.AssignedTo)
                .Include(t => t.Group)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status.ToString(),
                    Priority = t.Priority.ToString(),
                    CreatedById = t.CreatedById,
                    CreatedByName = t.CreatedBy.Name,
                    AssignedToId = t.AssignedToId,
                    AssignedToName = t.AssignedTo != null ? t.AssignedTo.Name : null,
                    GroupId = t.GroupId,
                    GroupName = t.Group.Name,
                    CreatedDate = t.CreatedDate,
                    DueDate = t.DueDate,
                    CompletedDate = t.CompletedDate,
                    LastUpdated = t.LastUpdated
                })
                .ToListAsync();

            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDto>> GetTask(int id)
        {
            var task = await _context.Tasks
                .Include(t => t.CreatedBy)
                .Include(t => t.AssignedTo)
                .Include(t => t.Group)
                .Include(t => t.Comments)
                .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null)
            {
                return NotFound();
            }

            var taskDto = new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status.ToString(),
                Priority = task.Priority.ToString(),
                CreatedById = task.CreatedById,
                CreatedByName = task.CreatedBy.Name,
                AssignedToId = task.AssignedToId,
                AssignedToName = task.AssignedTo?.Name,
                GroupId = task.GroupId,
                GroupName = task.Group.Name,
                CreatedDate = task.CreatedDate,
                DueDate = task.DueDate,
                CompletedDate = task.CompletedDate,
                LastUpdated = task.LastUpdated,
                Comments = task.Comments.Select(c => new TaskCommentDto
                {
                    Id = c.Id,
                    Comment = c.Comment,
                    UserName = c.User.Name,
                    CreatedDate = c.CreatedDate
                }).ToList()
            };

            return Ok(taskDto);
        }

        [HttpPost]
        public async Task<ActionResult<TaskDto>> CreateTask(CreateTaskDto createTaskDto)
        {
            var task = new TaskItem
            {
                Title = createTaskDto.Title,
                Description = createTaskDto.Description,
                Priority = Enum.Parse<Priority>(createTaskDto.Priority),
                CreatedById = createTaskDto.CreatedById,
                GroupId = createTaskDto.GroupId,
                DueDate = createTaskDto.DueDate,
                CreatedDate = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            // Add to history
            await AddTaskHistory(task.Id, createTaskDto.CreatedById, "Status", "", task.Status.ToString());

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, await GetTaskDto(task.Id));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, UpdateTaskDto updateTaskDto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            var oldStatus = task.Status.ToString();
            var oldAssignedTo = task.AssignedToId?.ToString() ?? "";

            task.Title = updateTaskDto.Title;
            task.Description = updateTaskDto.Description;
            task.Priority = Enum.Parse<Priority>(updateTaskDto.Priority);
            task.DueDate = updateTaskDto.DueDate;
            task.LastUpdated = DateTime.UtcNow;

            if (updateTaskDto.AssignedToId.HasValue)
            {
                task.AssignedToId = updateTaskDto.AssignedToId;
            }

            _context.Entry(task).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // Add history for assignment change
            if (oldAssignedTo != (task.AssignedToId?.ToString() ?? ""))
            {
                await AddTaskHistory(task.Id, updateTaskDto.UpdatedById, "AssignedTo", oldAssignedTo, task.AssignedToId?.ToString() ?? "");
            }

            return NoContent();
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateTaskStatus(int id, UpdateTaskStatusDto updateStatusDto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            var oldStatus = task.Status.ToString();
            var newStatus = Enum.Parse<TaskStatus>(updateStatusDto.Status);

            task.Status = newStatus;
            task.LastUpdated = DateTime.UtcNow;

            if (newStatus == TaskStatus.Completed || newStatus == TaskStatus.Closed)
            {
                task.CompletedDate = DateTime.UtcNow;
            }

            _context.Entry(task).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // Add to history
            await AddTaskHistory(task.Id, updateStatusDto.UpdatedById, "Status", oldStatus, newStatus.ToString());

            return NoContent();
        }

        [HttpPost("{id}/comments")]
        public async Task<ActionResult<TaskCommentDto>> AddComment(int id, CreateCommentDto commentDto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            var comment = new TaskComment
            {
                TaskId = id,
                UserId = commentDto.UserId,
                Comment = commentDto.Comment,
                CreatedDate = DateTime.UtcNow
            };

            _context.TaskComments.Add(comment);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(commentDto.UserId);
            var result = new TaskCommentDto
            {
                Id = comment.Id,
                Comment = comment.Comment,
                UserName = user.Name,
                CreatedDate = comment.CreatedDate
            };

            return Ok(result);
        }

        
        
        [HttpGet("group/{groupId}")]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasksByGroup(int groupId)
        {
            var tasks = await _context.Tasks
                .Include(t => t.CreatedBy)
                .Include(t => t.AssignedTo)
                .Include(t => t.Group)
                .Where(t => t.GroupId == groupId)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status.ToString(),
                    Priority = t.Priority.ToString(),
                    CreatedById = t.CreatedById,
                    CreatedByName = t.CreatedBy.Name,
                    AssignedToId = t.AssignedToId,
                    AssignedToName = t.AssignedTo != null ? t.AssignedTo.Name : null,
                    GroupId = t.GroupId,
                    GroupName = t.Group.Name,
                    CreatedDate = t.CreatedDate,
                    DueDate = t.DueDate,
                    CompletedDate = t.CompletedDate,
                    LastUpdated = t.LastUpdated
                })
                .ToListAsync();

            return Ok(tasks);
        }

        private async Task AddTaskHistory(int taskId, int changedById, string field, string oldValue, string newValue)
        {
            var history = new TaskHistory
            {
                TaskId = taskId,
                ChangedById = changedById,
                Field = field,
                OldValue = oldValue,
                NewValue = newValue,
                ChangedDate = DateTime.UtcNow
            };

            _context.TaskHistories.Add(history);
            await _context.SaveChangesAsync();
        }

        private async Task<TaskDto> GetTaskDto(int taskId)
        {
            var task = await _context.Tasks
                .Include(t => t.CreatedBy)
                .Include(t => t.AssignedTo)
                .Include(t => t.Group)
                .FirstOrDefaultAsync(t => t.Id == taskId);

            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status.ToString(),
                Priority = task.Priority.ToString(),
                CreatedById = task.CreatedById,
                CreatedByName = task.CreatedBy.Name,
                AssignedToId = task.AssignedToId,
                AssignedToName = task.AssignedTo?.Name,
                GroupId = task.GroupId,
                GroupName = task.Group.Name,
                CreatedDate = task.CreatedDate,
                DueDate = task.DueDate,
                CompletedDate = task.CompletedDate,
                LastUpdated = task.LastUpdated
            };
        }
    }
}