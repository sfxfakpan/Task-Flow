import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsDateString, MaxLength } from 'class-validator';
import { TaskStatus } from '../enum/task-status.enum';
import { TaskPriority } from '../enum/task-priority.enum';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implement user authentication',
    description: 'Task title',
    maxLength: 200,
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  readonly title: string;

  @ApiProperty({
    example: 'Implement JWT authentication with Passport',
    description: 'Task description',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  readonly description?: string;

  @ApiProperty({
    enum: TaskPriority,
    example: TaskPriority.HIGH,
    description: 'Task priority',
    default: TaskPriority.MEDIUM,
  })
  @IsEnum(TaskPriority, { message: 'Invalid priority value' })
  readonly priority: TaskPriority = TaskPriority.MEDIUM;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.TODO,
    description: 'Task status (kanban column)',
    default: TaskStatus.TODO,
  })
  @IsEnum(TaskStatus, { message: 'Invalid status value' })
  readonly status: TaskStatus = TaskStatus.TODO;

  @ApiProperty({
    example: '2026-02-15T23:59:59.000Z',
    description: 'Due date',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid ISO date string' })
  readonly dueDate?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'Assignee user ID',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Assignee ID must be a string' })
  readonly assigneeId?: string;
}