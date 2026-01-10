import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get tasks by project ID' })
  findByProject(@Param('projectId') projectId: string) {
    return this.tasksService.findByProject(+projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  update(@Param('id') id: string, @Body() updateTaskDto: Partial<CreateTaskDto>) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
