import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { BoardService } from '../../core/services/board.service';
import { Board } from '../../core/models/board.model';
import { BoardCardComponent } from './components/board-card/board-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, BoardCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  boards = signal<Board[]>([]);
  isLoading = signal<boolean>(false);

  constructor(
    private boardService: BoardService, private router: Router) { }

  ngOnInit() {

    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1000);
  }

  loadBoards() {
    this.isLoading.set(true);
    this.boardService.getBoards().subscribe({
      next: (data) => {
        this.boards.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  openBoard(board: Board) {
    console.log('Navigating to board:', board.name);
    //this.router.navigate(['/boards', board.id]);
  }

  createBoard() {
    const boardName = window.prompt("Enter board name:");

    if (boardName) {
      // Mock adding a board to the UI immediately
      this.boards.update(current => [
        ...current,
        {
          id: "234567890",
          name: boardName,
          description: 'New project board',
          createdAt: new Date(),
          updatedAt: new Date(),
          taskCount: 0
        }
      ]);
    }
  }

  editBoard(board: Board) {
    console.log('Open Edit Dialog', board);
  }

  deleteBoard(board: Board) {
    if (confirm(`Delete board "${board.name}"?`)) {
      this.boardService.deleteBoard(board.id).subscribe(() => this.loadBoards());
    }
  }
}