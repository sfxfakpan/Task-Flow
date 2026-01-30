import { User } from './user.model';

export interface Board {
  id: string;
  name: string;
  description?: string;
  owner: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}
