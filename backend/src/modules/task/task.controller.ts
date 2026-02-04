import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { DeleteTaskResponseDto } from './dtos/delete-task-response.dto';
import { Task } from './entities/task.entity';
import { TasksService } from './task.service';
import { BoardsService } from '../board/providers/board.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskStatus } from './enum/task-status.enum';

@ApiTags('Tasks')
@Controller('boards/:boardId/tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly boardsService: BoardsService,
  ) {}

  /**
   * Get all tasks for a board
   */
  @Get()
  @ApiOperation({ summary: 'Get all tasks for a board' })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully',
    type: [Task],
  })
  @ApiResponse({ status: 404, description: 'Board not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not board owner' })
  async findAll(@Param('boardId') boardId: string, @Req() request): Promise<Task[]> {
    await this.verifyBoardOwnership(boardId, request.user.id);
    return this.tasksService.findAllByBoardId(boardId);
  }

  /**
   * Get a single task by ID
   */
  @Get(':taskId')
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully', type: Task })
  @ApiResponse({ status: 404, description: 'Task or board not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not board owner' })
  async findOne(
    @Param('boardId') boardId: string,
    @Param('taskId') taskId: string,
    @Req() request,
  ): Promise<Task> {
    await this.verifyBoardOwnership(boardId, request.user.id);
    const task = await this.tasksService.findOne(taskId);

    // Verify task belongs to the board
    if (task.boardId !== boardId) {
      throw new ForbiddenException('Task does not belong to this board');
    }

    return task;
  }

  /**
   * Create a new task
   */
  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully', type: Task })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 403, description: 'Forbidden - not board owner' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  async create(
    @Param('boardId') boardId: string,
    @Body() createTaskDto: CreateTaskDto,
    @Req() request,
  ): Promise<Task> {
    await this.verifyBoardOwnership(boardId, request.user.id);
    return this.tasksService.create(boardId, createTaskDto);
  }

  /**
   * Update a task
   */
  @Patch(':taskId')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully', type: Task })
  @ApiResponse({ status: 404, description: 'Task or board not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not board owner' })
  async update(
    @Param('boardId') boardId: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() request,
  ): Promise<Task> {
    await this.verifyBoardOwnership(boardId, request.user.id);
    const task = await this.tasksService.findOne(taskId);

    if (task.boardId !== boardId) {
      throw new ForbiddenException('Task does not belong to this board');
    }

    return this.tasksService.update(taskId, updateTaskDto);
  }

  /**
   * Update task position (for drag-drop)
   */
  // ... existing imports ...

@Patch(':taskId/position')
@ApiOperation({ summary: 'Update task position (for drag-drop reordering)' })
@ApiResponse({ status: 200, description: 'Position updated successfully', type: Task })
@ApiResponse({ status: 404, description: 'Task or board not found' })
@ApiResponse({ status: 403, description: 'Forbidden - not board owner' })
@ApiResponse({ status: 400, description: 'Bad request - invalid position' })
async updatePosition(
  @Param('boardId') boardId: string,
  @Param('taskId') taskId: string,
  @Body() body: { position: number; status?: TaskStatus }, 
  @Req() request,
): Promise<Task> {
  await this.verifyBoardOwnership(boardId, request.user.id);
  const task = await this.tasksService.findOne(taskId);

  if (task.boardId !== boardId) {
    throw new ForbiddenException('Task does not belong to this board');
  }

  return this.tasksService.updatePosition(
    taskId, 
    body.position, 
    body.status
  );
}

  /**
   * Soft delete a task
   */
  @Delete(':taskId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Soft delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully', type: DeleteTaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task or board not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not board owner' })
  async remove(
    @Param('boardId') boardId: string,
    @Param('taskId') taskId: string,
    @Req() request,
  ): Promise<DeleteTaskResponseDto> {
    await this.verifyBoardOwnership(boardId, request.user.id);
    const task = await this.tasksService.findOne(taskId);

    if (task.boardId !== boardId) {
      throw new ForbiddenException('Task does not belong to this board');
    }

    return await this.tasksService.remove(taskId);
  }

  /**
   * Helper method to verify board ownership
   */
  private async verifyBoardOwnership(boardId: string, userId: string): Promise<void> {
    const board = await this.boardsService.findOne(boardId, userId);
    if (!board) {
      throw new ForbiddenException('You do not have access to this board');
    }
  }
}
