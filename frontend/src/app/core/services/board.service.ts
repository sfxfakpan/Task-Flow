import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Board, BoardDetail, CreateBoardDto, UpdateBoardDto } from '../models/board.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  
  private apiUrl = environment.apiUrl;
  private endpoints = environment.endpoints.boards;
  
  constructor(private http: HttpClient) { }

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.apiUrl}${this.endpoints.list}`).pipe(
      catchError(this.handleError)
    );
  }

  getBoard(id: string): Observable<BoardDetail> {
    const url = `${this.apiUrl}${this.endpoints.get.replace(':id', id)}`;
    return this.http.get<BoardDetail>(url).pipe(
      catchError(this.handleError)
    );
  }

  createBoard(data: CreateBoardDto): Observable<Board> {
    return this.http.post<Board>(`${this.apiUrl}${this.endpoints.create}`, data).pipe(
      catchError(this.handleError)
    );
  }

  updateBoard(id: string, data: UpdateBoardDto): Observable<Board> {
    const url = `${this.apiUrl}${this.endpoints.update.replace(':id', id)}`;
    return this.http.patch<Board>(url, data).pipe(
      catchError(this.handleError)
    );
  }

  deleteBoard(id: string): Observable<void> {
    const url = `${this.apiUrl}${this.endpoints.delete.replace(':id', id)}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }

  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      
      errorMessage = `Network Error: ${error.error.message}`;
    } else {
      
      
      errorMessage = `Server Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}