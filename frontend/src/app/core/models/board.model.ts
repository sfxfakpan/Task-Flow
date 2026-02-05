import { User } from './user.model';
import { Task } from './task.model';

export interface Board {
  id: string;
  title: string;
  description?: string;
  owner?: User;
  members?: User[];
  createdAt: Date;
  updatedAt?: Date;
  taskCount?: number;
  tasks?: Task[];
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
  title: string;
  description?: string;
  memberIds?: string[];
}
export interface UpdateBoardDto {
  title?: string;
  description?: string;
  memberIds?: string[];
}
