import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu'; // <--- FIXES THE ERROR
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Board } from '../../../../core/models/board.model'; // Check this path

@Component({
  selector: 'app-board-card',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './board-card.component.html', // <--- Points to your file
  styleUrl: './board-card.component.css'
})
export class BoardCardComponent {
  @Input({ required: true }) board!: Board;
  @Output() cardClick = new EventEmitter<Board>();
  @Output() edit = new EventEmitter<Board>();
  @Output() delete = new EventEmitter<Board>();
}