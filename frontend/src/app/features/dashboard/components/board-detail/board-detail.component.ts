import { Component, OnInit, OnDestroy, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  DragDropModule
} from '@angular/cdk/drag-drop';

import { BoardService } from '../../../../core/services/board.service';
import { TaskService } from '../../../../core/services/task.service';
import { Board } from '../../../../core/models/board.model';
import { Task, TaskStatus } from '../../../../core/models/task.model';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskDialogComponent, RouterLink],
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.css']
})
export class BoardDetailComponent implements OnInit, OnDestroy {
  board: Board | null = null;
  tasks: Task[] = [];


  columns: Record<TaskStatus, Task[]> = {
    [TaskStatus.TODO]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.DONE]: []
  };

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

  private destroy$ = new Subject<void>();
  private boardId: string = '';

  constructor(
    private boardService: BoardService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
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

          this.tasks = Array.isArray(tasks) ? tasks : [];
          this.groupTasksByStatus();
        },
        error: (err) => {
          console.error('Task Load Error:', err);
          this.error.set('Failed to load tasks');
        }
      });
  }

  private groupTasksByStatus(): void {

    this.columns = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: []
    };


    this.tasks.forEach(task => {
      if (this.columns[task.status]) {
        this.columns[task.status].push(task);
      }
    });
  }


  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id as TaskStatus;


      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );


      const updatedTask = { ...task, status: newStatus };

      event.container.data[event.currentIndex] = updatedTask;


      this.taskService.updateTask(this.boardId, task.id, { status: newStatus })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (err) => {

            console.error('Failed to update status', err);

          }
        });
    }
  }

  deleteTask(task: Task) {
    if (!confirm('Are you sure you want to delete this task?')) return;


    const currentTasks = this.columns[task.status];
    this.columns[task.status] = currentTasks.filter(t => t.id !== task.id);

    this.taskService.deleteTask(this.boardId, task.id).subscribe({
      error: () => {

        this.columns[task.status] = currentTasks;
        alert('Failed to delete task');
      }
    });
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
            this.loadTasks();
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
            this.tasks.push(newTask);
            this.groupTasksByStatus();
            this.onCloseTaskDialog();
          },
          error: () => this.error.set('Failed to create task')
        });
    }
  }


  getTaskCountForStatus(status: TaskStatus): number {
    return this.columns[status]?.length || 0;
  }

  getTasksForStatus(status: TaskStatus): Task[] {
    return this.columns[status] || [];
  }

  onAddTask(status: TaskStatus): void {
    this.selectedStatusForNewTask.set(status);
    this.showTaskDialog.set(true);
  }

  onTaskClick(task: Task): void { }
}