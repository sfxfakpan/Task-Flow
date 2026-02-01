import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services & Models
import { BoardService } from '../../core/services/board.service';
import { Board } from '../../core/models/board.model';
import { BoardCardComponent } from './components/board-card/board-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BoardCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private boardService = inject(BoardService);
  private router = inject(Router);

  // Signals
  boards = signal<Board[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadBoards();
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
    this.router.navigate(['/boards', board.id]);
  }

  createBoard() {
    console.log('Open Create Dialog');
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