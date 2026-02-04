import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CreateBoardDto } from '../dtos/create-board.dto';
import { UpdateBoardDto } from '../dtos/update-board.dto';
import { Board } from '../entities/board.entity';


@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async findAll(userId: number | string): Promise<Board[]> {
    return this.boardRepository.find({
      where: { userId: userId as any } as FindOptionsWhere<Board>,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: number | string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: { id, userId: userId as any } as FindOptionsWhere<Board>,
      relations: ['tasks'],
    });

    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    return board;
  }

  async create(createBoardDto: CreateBoardDto, userId: number | string): Promise<Board> {
    try {
      // Ensure userId is properly typed
      const boardData = {
        ...createBoardDto,
        userId: userId as any, // TypeORM will handle the conversion
      };

      const board = this.boardRepository.create(boardData);
      return await this.boardRepository.save(board);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('A board with this title already exists');
      }
      throw error;
    }
  }

  async update(
    id: string,
    updateBoardDto: UpdateBoardDto,
    userId: number | string,
  ): Promise<Board> {
    const board = await this.findOne(id, userId);

    Object.assign(board, updateBoardDto);
    return await this.boardRepository.save(board);
  }

  async remove(id: string, userId: number | string): Promise<void> {
    const board = await this.findOne(id, userId);
    await this.boardRepository.softDelete(id);
  }

  async restore(id: string, userId: number | string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: { id, userId: userId as any } as FindOptionsWhere<Board>,
      withDeleted: true,
    });

    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    await this.boardRepository.restore(id);
    return board;
  }
}