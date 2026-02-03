import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { Board } from './entities/board.entity';
import { BoardsService } from './providers/board.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@ApiTags('Boards')
@Controller('boards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all boards for current user' })
  @ApiResponse({ status: 200, description: 'Boards retrieved successfully', type: [Board] })
  async findAll(@Req() request): Promise<Board[]> {
    const userId = request.user.id;
    return this.boardsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific board by ID' })
  @ApiResponse({ status: 200, description: 'Board retrieved successfully', type: Board })
  @ApiResponse({ status: 404, description: 'Board not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not owner' })
  async findOne(@Param('id') id: string, @Req() request): Promise<Board> {
    const userId = request.user.id;
    return this.boardsService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new board' })
  @ApiResponse({ status: 201, description: 'Board created successfully', type: Board })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async create(
    @Body() createBoardDto: CreateBoardDto,
    @Req() request,
  ): Promise<Board> {
    const userId = request.user.id;
    return this.boardsService.create(createBoardDto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a board' })
  @ApiResponse({ status: 200, description: 'Board updated successfully', type: Board })
  @ApiResponse({ status: 404, description: 'Board not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not owner' })
  async update(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @Req() request,
  ): Promise<Board> {
    const userId = request.user.id;
    return this.boardsService.update(id, updateBoardDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a board' })
  @ApiResponse({ status: 200, description: 'Board deleted successfully' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not owner' })
  async remove(@Param('id') id: string, @Req() request): Promise<void> {
    const userId = request.user.id;
    return this.boardsService.remove(id, userId);
  }
}