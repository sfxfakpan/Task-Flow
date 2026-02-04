import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, FindOptionsWhere } from 'typeorm';
import { Board } from '../board/entities/board.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './enum/task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    private readonly dataSource: DataSource, // Required for transactions
  ) {}

  /**
   * Get all tasks for a specific board, ordered by status and position
   */
  async findAllByBoardId(boardId: string): Promise<Task[]> {
    try {
      return await this.taskRepository.find({
        where: { boardId } as FindOptionsWhere<Task>,
        relations: ['assignee'],
        order: {
          status: 'ASC',
          position: 'ASC',
        },
      });
    } catch (error) {
      if (error.code === '22P02') {
        throw new InternalServerErrorException(
          'Database contains invalid task status values. Valid values are: TODO, IN_PROGRESS, DONE',
        );
      }
      throw error;
    }
  }

  /**
   * Get a single task by ID
   */
  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id } as FindOptionsWhere<Task>,
      relations: ['assignee'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  /**
   * Calculate next position for a new task in a specific status column
   */
  private async calculateNextPosition(boardId: string, status: TaskStatus): Promise<number> {
    const maxPositionTask = await this.taskRepository
      .createQueryBuilder('task')
      .where('task.boardId = :boardId', { boardId })
      .andWhere('task.status = :status', { status })
      .andWhere('task.deletedAt IS NULL')
      .orderBy('task.position', 'DESC')
      .getOne();

    return maxPositionTask ? maxPositionTask.position + 1 : 0;
  }

  /**
   * Create a new task with auto-calculated position
   */
  async create(boardId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const board = await this.boardRepository.findOne({
        where: { id: boardId },
        withDeleted: false,
      });

      if (!board) {
        throw new NotFoundException('Board not found');
      }

      const position = await this.calculateNextPosition(boardId, createTaskDto.status);

      const task = this.taskRepository.create({
        ...createTaskDto,
        boardId,
        position,
      });

      return await this.taskRepository.save(task);
    } catch (error) {
      if (error.code === '23503') {
        throw new BadRequestException('Invalid boardId or assigneeId');
      }
      throw error;
    }
  }

  /**
   * Update a task
   */
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (updateTaskDto.status && updateTaskDto.status !== task.status) {
      updateTaskDto.position = await this.calculateNextPosition(
        task.boardId,
        updateTaskDto.status,
      );
    }

    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  /**
   * Update task position (for drag-drop) - WITH TRANSACTION & POSITION CLAMPING
   */
  async updatePosition(
    id: string,
    newPosition: number,
    newStatus?: TaskStatus,
  ): Promise<Task> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const task = await this.findOne(id);

        // Get all tasks in the target status column
        const tasksInColumn = await manager.find(Task, {
          where: {
            boardId: task.boardId,
            status: newStatus || task.status,
          } as FindOptionsWhere<Task>,
          withDeleted: false,
          order: { position: 'ASC' },
        });

        // Remove current task from list
        const filteredTasks = tasksInColumn.filter(t => t.id !== task.id);

        // Clamp position to valid range [0, filteredTasks.length]
        const clampedPosition = Math.max(0, Math.min(newPosition, filteredTasks.length));

        // Insert task at new position
        filteredTasks.splice(clampedPosition, 0, task);

        // Update positions for all tasks
        for (let i = 0; i < filteredTasks.length; i++) {
          filteredTasks[i].position = i;
          if (newStatus) {
            filteredTasks[i].status = newStatus;
          }
        }

        // Save all tasks in transaction
        await manager.save(filteredTasks);

        return task;
      });
    } catch (error) {
      if (error.code === '22P02') {
        throw new InternalServerErrorException(
          'Database contains invalid task status values. Valid values are: TODO, IN_PROGRESS, DONE. Please check your database for corrupted records.',
        );
      }
      throw error;
    }
  }

  /**
   * Soft delete a task
   */
  async remove(id: string): Promise<{ success: boolean; message: string; taskId: string }> {
    const task = await this.findOne(id);
    await this.taskRepository.softDelete(id);
    return {
      success: true,
      message: 'Task deleted successfully',
      taskId: id,
    };
  }
}