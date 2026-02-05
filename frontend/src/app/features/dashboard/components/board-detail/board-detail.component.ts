import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import {
  CdkDragDrop,
  moveItemInArray,
  DragDropModule
} from '@angular/cdk/drag-drop';

import { BoardService } from '../../../../core/services/board.service';
import { TaskService } from '../../../../core/services/task.service';
import { Board } from '../../../../core/models/board.model';
import { Task, TaskStatus } from '../../../../core/models/task.model';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { ConfirmDialogComponent } from 'frontend/src/app/shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskDialogComponent, RouterLink, ConfirmDialogComponent],
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.css']
})
export class BoardDetailComponent implements OnInit, OnDestroy {
  board: Board | null = null;
  tasks = signal<Task[]>([]);
  taskToDelete = signal<Task | null>(null);

  initiateDelete(task: Task) {
    this.taskToDelete.set(task);
  }

  columns = signal<Record<TaskStatus, Task[]>>({
    [TaskStatus.TODO]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.DONE]: []
  });

  isLoading = signal(true);
  error = signal<string | null>(null);
  editingTask = signal<Task | null>(null);

  showTaskDialog = signal(false);
  selectedStatusForNewTask = signal<TaskStatus>(TaskStatus.TODO);
  isCreatingTask = signal(false);

  readonly statuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
  readonly statusLabels: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'To Do',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.DONE]: 'Done',
  };


  readonly STATUS_ORDER = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

  private destroy$ = new Subject<void>();
  private boardId: string = '';

  constructor(
    private boardService: BoardService,
    private taskService: TaskService,
    private route: ActivatedRoute,
  ) { }

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

  confirmDelete() {
    const task = this.taskToDelete();
    const status = task?.status as TaskStatus;
    const current = [...(this.columns()[status] || [])];
    const newArray = current.filter(t => t.id !== task?.id);
    this.columns.update(cols => ({ ...cols, [status]: newArray }));

    this.taskService.deleteTask(this.boardId, task?.id ?? '').subscribe({
      error: () => {
        this.columns.update(cols => ({ ...cols, [status]: current }));
        alert('Failed to delete task');
      }
    });

    this.taskToDelete.set(null);
  }
  cancelDelete() {
    this.taskToDelete.set(null);
  }

  private loadBoardAndTasks(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.boardService.getBoard(this.boardId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (board) => {
          this.board = board;
          this.loadTasks();
        },
        error: (err) => {
          this.error.set('Failed to load board');
          this.isLoading.set(false);
        }
      });
  }

  private loadTasks(): void {
    this.taskService.getTasks(this.boardId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (tasks) => {
          this.tasks.set(Array.isArray(tasks) ? tasks : []);
          this.groupTasksByStatus();
        },
        error: (err) => {
          this.error.set('Failed to load tasks');
        }
      });
  }

  private groupTasksByStatus(): void {
    const grouped: Record<TaskStatus, Task[]> = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: []
    };

    const tasks = this.tasks();
    tasks.forEach((task: Task) => {
      const status = task.status as TaskStatus;
      if (grouped[status]) grouped[status].push(task);
    });

    this.columns.set(grouped);
  }


  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {

      const status = event.container.id as TaskStatus;
      const current = [...(this.columns()[status] || [])];
      moveItemInArray(current, event.previousIndex, event.currentIndex);
      this.columns.update(cols => ({ ...cols, [status]: current }));
    } else {

      const prevStatus = event.previousContainer.id as TaskStatus;
      const newStatus = event.container.id as TaskStatus;


      const prevIndex = this.STATUS_ORDER.indexOf(prevStatus);
      const newIndex = this.STATUS_ORDER.indexOf(newStatus);
      if (Math.abs(newIndex - prevIndex) > 1) {
        return;
      }
      const prevArray = [...(this.columns()[prevStatus] || [])];
      const moved = prevArray.splice(event.previousIndex, 1)[0];
      const newArray = [...(this.columns()[newStatus] || [])];

      const updatedTask = { ...moved, status: newStatus };
      newArray.splice(event.currentIndex, 0, updatedTask);

      this.columns.set({
        ...this.columns(),
        [prevStatus]: prevArray,
        [newStatus]: newArray,
      });

      this.taskService.updateTask(this.boardId, moved.id, { status: newStatus })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (err) => {
            console.error('Failed to update status', err);

            this.groupTasksByStatus();
          }
        });
    }
  }


  openEditTask(task: Task) {
    this.editingTask.set(task);
    this.selectedStatusForNewTask.set(task.status);
    this.showTaskDialog.set(true);
  }

  onCloseTaskDialog(): void {
    this.showTaskDialog.set(false);
    this.isCreatingTask.set(false);
    this.editingTask.set(null);
  }

  onSaveTask(taskData: Partial<Task>): void {
    if (!this.boardId) return;
    this.isCreatingTask.set(true);

    const taskToEdit = this.editingTask();

    if (taskToEdit) {
      this.taskService.updateTask(this.boardId, taskToEdit.id, taskData)
        .pipe(finalize(() => this.isCreatingTask.set(false)))
        .subscribe({
          next: (updated) => {
            this.tasks.update(list => list.map(t => t.id === updated.id ? updated : t));
            this.groupTasksByStatus();
            this.onCloseTaskDialog();
          },
          error: () => this.error.set('Failed to update task')
        });
    } else {
      const createTaskDto = { ...taskData, boardId: this.boardId };
      this.taskService.createTask(this.boardId, createTaskDto)
        .pipe(finalize(() => this.isCreatingTask.set(false)))
        .subscribe({
          next: (newTask) => {
            this.tasks.update(tasks => [...tasks, newTask]);
            this.groupTasksByStatus();
            this.onCloseTaskDialog();
          },
          error: () => this.error.set('Failed to create task')
        });
    }
  }

  getTaskCountForStatus(status: TaskStatus): number {
    return this.columns()[status]?.length || 0;
  }

  getTasksForStatus(status: TaskStatus): Task[] {
    return this.columns()[status] || [];
  }

  onAddTask(status: TaskStatus): void {
    this.selectedStatusForNewTask.set(status);
    this.showTaskDialog.set(true);
  }

  onTaskClick(task: Task): void { }

  truncateDescription(
    description: string | undefined,
    maxLength: number = 100,
  ): string {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  }
}