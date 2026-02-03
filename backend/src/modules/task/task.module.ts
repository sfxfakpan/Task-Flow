import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Task } from './entities/task.entity';
import { TasksController } from './task.controller';
import { TasksService } from './task.service';
import { Board } from '../board/entities/board.entity';
import { BoardsService } from '../board/providers/board.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Board]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService, BoardsService],
  exports: [TasksService],
})
export class TaskModule {}
