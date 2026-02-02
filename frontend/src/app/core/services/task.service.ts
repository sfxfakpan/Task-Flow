import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { Task, TaskStatus } from '../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTasks(boardId: string): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${this.apiUrl}/boards/${boardId}/tasks`)
      .pipe(catchError(this.handleError));
  }

  getTask(taskId: string): Observable<Task> {
    return this.http
      .get<Task>(`${this.apiUrl}/tasks/${taskId}`)
      .pipe(catchError(this.handleError));
  }

  createTask(boardId: string, data: Partial<Task>): Observable<Task> {
    return this.http
      .post<Task>(`${this.apiUrl}/boards/${boardId}/tasks`, data)
      .pipe(catchError(this.handleError));
  }

  updateTask(taskId: string, data: Partial<Task>): Observable<Task> {
    return this.http
      .put<Task>(`${this.apiUrl}/tasks/${taskId}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteTask(taskId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/tasks/${taskId}`)
      .pipe(catchError(this.handleError));
  }

  updateTaskPosition(
    taskId: string,
    status: TaskStatus,
    position: number,
  ): Observable<Task> {
    return this.http
      .patch<Task>(`${this.apiUrl}/tasks/${taskId}/position`, {
        status,
        position,
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => ({
      message: error.error?.message || 'Task operation failed',
      status: error.status,
    }));
  }
}
