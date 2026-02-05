import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Board } from '../../../../core/models/board.model';

@Component({
  selector: 'app-board-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.css']
})
export class BoardCardComponent {
  @Input() board!: Board;
  @Output() cardClick = new EventEmitter<Board>();
  @Output() edit = new EventEmitter<Board>();
  @Output() delete = new EventEmitter<Board>();


  menuOpen = signal(false);

  get taskCount(): number {
    if (this.board) {
      if ('tasks' in this.board && Array.isArray(this.board.tasks)) {
        return this.board.tasks.length || 0;
      }
    }
    return this.board?.taskCount || 0;
  }
  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuOpen.update(value => !value);
  }
}