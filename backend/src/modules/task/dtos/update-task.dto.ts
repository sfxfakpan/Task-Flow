import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { TaskPriority } from '../enum/task-priority.enum';
import { TaskStatus } from '../enum/task-status.enum';


export class UpdateTaskDto {
  @ApiProperty({
    example: 'Implement user authentication',
    description: 'Task title',
    required: false,
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  readonly title?: string;

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
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Invalid priority value' })
  readonly priority?: TaskPriority;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    description: 'Task status (kanban column)',
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Invalid status value' })
  readonly status?: TaskStatus;

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

  @ApiProperty({
    example: 5,
    description: 'Task position in column (for drag-drop ordering)',
    required: false,
    minimum: 0,
  })
  @IsOptional()
  position?: number;
}