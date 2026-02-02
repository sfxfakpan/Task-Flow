import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Board } from '../entities/board.entity';
import { CreateBoardDto } from '../dtos/create-board.dto';
import { UpdateBoardDto } from '../dtos/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  /**
   * Find all boards for a specific user
   */
  async findAll(userId: string): Promise<Board[]> {
    return this.boardRepository.find({
      where: { userId } as FindOptionsWhere<Board>,
      relations: ['tasks'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find a board by ID with tasks
   */
  async findOne(id: string, userId: string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: { id, userId } as FindOptionsWhere<Board>,
      relations: ['tasks', 'user'],
    });

    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    return board;
  }

  /**
   * Create a new board
   */
  async create(createBoardDto: CreateBoardDto, userId: string): Promise<Board> {
    const board = this.boardRepository.create({
      ...createBoardDto,
      userId,
    });

    return await this.boardRepository.save(board);
  }

  /**
   * Update a board
   */
  async update(
    id: string,
    updateBoardDto: UpdateBoardDto,
    userId: string,
  ): Promise<Board> {
    const board = await this.findOne(id, userId);

    Object.assign(board, updateBoardDto);
    return await this.boardRepository.save(board);
  }

  /**
   * Soft delete a board
   */
  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);
    await this.boardRepository.softDelete(id);
  }

  /**
   * Restore a soft-deleted board
   */
  async restore(id: string, userId: string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: { id, userId } as FindOptionsWhere<Board>,
      withDeleted: true,
    });

    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    await this.boardRepository.restore(id);
    return board;
  }
}