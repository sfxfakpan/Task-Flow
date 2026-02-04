import { ApiProperty } from '@nestjs/swagger';

export class DeleteTaskResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the task was successfully deleted',
  })
  success: boolean;

  @ApiProperty({
    example: 'Task deleted successfully',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6',
    description: 'ID of the deleted task',
  })
  taskId: string;
}
