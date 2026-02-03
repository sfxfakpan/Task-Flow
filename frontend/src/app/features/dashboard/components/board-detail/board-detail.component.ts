import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import { BoardService } from '../../../../core/services/board.service';
import { TaskService } from '../../../../core/services/task.service';
import { Board, BoardColumn } from '../../../../core/models/board.model';
import {
  Task,
  TaskStatus,
  TaskPriority,
} from '../../../../core/models/task.model';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [CommonModule, TaskDialogComponent, TaskCardComponent],
  templateUrl: './board-detail.component.html',
  styleUrl: './board-detail.component.css',
})
export class BoardDetailComponent implements OnInit, OnDestroy {
  board: Board | null = null;
  tasks: Task[] = [];
  columns: Map<TaskStatus, Task[]> = new Map();

  isLoading = true;
  error: string | null = null;
  showTaskDialog = signal(false);
  selectedStatusForNewTask = signal<TaskStatus>(TaskStatus.TODO);
  isCreatingTask = signal(false);

  readonly statuses = [
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];
  readonly statusLabels: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'TODO',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.DONE]: 'Done',
  };

  private destroy$ = new Subject<void>();
  private boardId: string = '';

  constructor(
    private boardService: BoardService,
    private taskService: TaskService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.boardId = params['id'];
      this.loadBoardAndTasks();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBoardAndTasks(): void {
    this.isLoading = true;
    this.error = null;

    this.boardService
      .getBoard(this.boardId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (board) => {
          this.board = board;
          this.loadTasks();
        },
        error: (err) => {
          this.error = 'Failed to load board';
          this.isLoading = false;
        },
      });
  }

  private loadTasks(): void {
    this.taskService
      .getTasks(this.boardId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.groupTasksByStatus();
        },
        error: (err) => {
          this.error = 'Failed to load tasks';
        },
      });
  }

  private groupTasksByStatus(): void {
    this.columns.clear();

    this.statuses.forEach((status) => {
      this.columns.set(
        status,
        this.tasks.filter((task) => task.status === status),
      );
    });
  }

  getTaskCountForStatus(status: TaskStatus): number {
    return this.columns.get(status)?.length || 0;
  }

  getTasksForStatus(status: TaskStatus): Task[] {
    return this.columns.get(status) || [];
  }

  onAddTask(status: TaskStatus): void {
    this.selectedStatusForNewTask.set(status);
    this.showTaskDialog.set(true);
  }

  onCloseTaskDialog(): void {
    this.showTaskDialog.set(false);
    this.isCreatingTask.set(false);
  }

  onSaveTask(taskData: Partial<Task>): void {
    if (!this.boardId) {
      return;
    }

    this.isCreatingTask.set(true);
    const createTaskDto: Partial<Task> = {
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      boardId: this.boardId,
    };

    this.taskService
      .createTask(this.boardId, createTaskDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newTask) => {
          this.tasks.push(newTask);
          this.groupTasksByStatus();
          this.onCloseTaskDialog();
          this.isCreatingTask.set(false);
        },
        error: (err) => {
          this.isCreatingTask.set(false);
          this.error = 'Failed to create task';
        },
      });
  }

  onTaskClick(task: Task): void {}

  getPriorityClass(priority: string): string {
    return `priority-${priority.toLowerCase()}`;
  }
}
