import { User } from './user.model';
import { Task } from './task.model';

export interface Board {
  id: string;
  name: string;
  description?: string;
  owner?: User;
  members?: User[];
  createdAt: string;
  updatedAt: string;
  taskCount?: number;
}
export interface BoardDetail extends Board {
  columns: BoardColumn[];
}
export interface BoardColumn {
  id: string;
  name: string;
  tasks: Task[];
  order: number;
}
export interface CreateBoardDto {
  name: string;
  description?: string;
  memberIds?: string[];
}
export interface UpdateBoardDto {
  name?: string;
  description?: string;
  memberIds?: string[];
}
