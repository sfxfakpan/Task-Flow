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


  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuOpen.update(value => !value);
  }
}