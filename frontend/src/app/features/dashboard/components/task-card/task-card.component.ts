import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskPriority } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() taskClick = new EventEmitter<Task>();

  onCardClick(): void {
    this.taskClick.emit(this.task);
  }

  getPriorityBorderClass(): string {
    return `priority-border-${this.task.priority.toLowerCase()}`;
  }

  truncateDescription(
    description: string | undefined,
    maxLength: number = 100,
  ): string {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  }

  getInitials(name: string | undefined): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
