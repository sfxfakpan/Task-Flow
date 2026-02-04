import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { Task, TaskStatus } from '../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly apiUrl = environment.apiUrl;
  private readonly endpoints = environment.endpoints.tasks;

  constructor(private http: HttpClient) {}


  getTasks(boardId: string): Observable<Task[]> {
    const url = `${this.apiUrl}${this.endpoints.list.replace(':boardId', boardId)}`;
    return this.http
      .get<Task[]>(url)
      .pipe(catchError(this.handleError));
  }

  getTask(boardId: string, taskId: string): Observable<Task> {
    let url = `${this.apiUrl}${this.endpoints.get.replace(':boardId', boardId)}`;
    url = url.replace(':taskId', taskId);
    return this.http
      .get<Task>(url)
      .pipe(catchError(this.handleError));
  }


  createTask(boardId: string, data: Partial<Task>): Observable<Task> {
    const url = `${this.apiUrl}${this.endpoints.create.replace(':boardId', boardId)}`;
    return this.http
      .post<Task>(url, data)
      .pipe(catchError(this.handleError));
  }

  updateTask(boardId: string, taskId: string, data: Partial<Task>): Observable<Task> {
    let url = `${this.apiUrl}${this.endpoints.update.replace(':boardId', boardId)}`;
    url = url.replace(':taskId', taskId);
    return this.http
      .patch<Task>(url, data)
      .pipe(catchError(this.handleError));
  }

  deleteTask(boardId: string, taskId: string): Observable<void> {
    let url = `${this.apiUrl}${this.endpoints.delete.replace(':boardId', boardId)}`;
    url = url.replace(':taskId', taskId);
    return this.http
      .delete<void>(url)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update task position (for drag-drop reordering)
   */
  updateTaskPosition(
    boardId: string,
    taskId: string,
    position: number,
    status?: TaskStatus,
  ): Observable<Task> {
    let url = `${this.apiUrl}${this.endpoints.updatePosition.replace(':boardId', boardId)}`;
    url = url.replace(':taskId', taskId);
    const body = { position, ...(status && { status }) };
    return this.http
      .patch<Task>(url, body)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => ({
      message: error.error?.message || 'Task operation failed',
      status: error.status,
    }));
  }
}

