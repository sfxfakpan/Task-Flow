import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({
    example: 'Project Alpha',
    description: 'Board title',
    maxLength: 200,
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  readonly title: string;

  @ApiProperty({
    example: 'Kanban board for Project Alpha',
    description: 'Board description',
    required: false,
    maxLength: 1000,
  })
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  readonly description?: string;
}