import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BoardService } from '../../core/services/board.service';
import { Board } from '../../core/models/board.model';
import { BoardCardComponent } from './components/board-card/board-card.component';
import { BoardDialogComponent } from './components/board-dialog/board-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { NavbarComponent } from './components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BoardDialogComponent, BoardCardComponent, ConfirmDialogComponent, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  boards = signal<Board[]>([]);
  isLoading = signal<boolean>(false);
  showDialog = signal(false);
  editingBoard = signal<Board | null>(null);
  boardToDelete = signal<Board | null>(null);

  initiateDelete(board: Board) {
    this.boardToDelete.set(board);
  }

  confirmDelete() {
    const board = this.boardToDelete();
    if (board) {
      this.boards.update(current => current.filter(b => b.id !== board.id));
      this.boardToDelete.set(null);
    }
  }
  cancelDelete() {
    this.boardToDelete.set(null);
  }

  constructor(
    private boardService: BoardService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1000);
  }

  // loadBoards() {
  //   this.isLoading.set(true);
  //   this.boardService.getBoards().subscribe({
  //     next: (data) => {
  //       this.boards.set(data);
  //       this.isLoading.set(false);
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.isLoading.set(false);
  //     }
  //   });
  // }

  openCreateDialog() {
    this.editingBoard.set(null);
    this.showDialog.set(true);
  }

  openEditDialog(board: Board) {
    this.editingBoard.set(board);
    this.showDialog.set(true);
  }

  handleSave(formData: { name: string; description: string }) {
    const editingBoard = this.editingBoard();
    if (editingBoard !== null) {
      this.boardService.updateBoard(editingBoard.id, formData);
    } else {
      const newBoard: Board = {
        id: "Date.now()",
        ...formData,
        createdAt: new Date(),
        taskCount: 0
      };
      this.boards.update(current => [newBoard, ...current]);

      // this.boardService.createBoard(formData);
    }
    this.closeDialog();
  }

  closeDialog() {
    this.showDialog.set(false);
    this.editingBoard.set(null);
  }

  deleteBoard(board: Board) {
    this.boardService.deleteBoard(board.id);
  }
}
