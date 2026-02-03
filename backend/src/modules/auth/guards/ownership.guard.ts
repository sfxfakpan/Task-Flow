import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../../board/entities/board.entity';


@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const boardId = request.params.id || request.body.boardId;

    if (!user || !user.userId) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!boardId) {
      return true; // No board ID to check (e.g., GET /boards)
    }

    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      withDeleted: false,
    });

    if (!board) {
      throw new ForbiddenException('Board not found');
    }

    if (board.userId !== user.userId) {
      throw new ForbiddenException('You do not have permission to access this board');
    }

    request.board = board;
    return true;
  }
}