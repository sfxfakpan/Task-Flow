import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBoardDto {
  @ApiProperty({
    example: 'Project Alpha',
    description: 'Board title',
    required: false,
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  readonly title?: string;

  @ApiProperty({
    example: 'Kanban board for Project Alpha',
    description: 'Board description',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  readonly description?: string;
}