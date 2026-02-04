import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TaskService } from '../../../../core/services/task.service';
import {
  Task,
  TaskStatus,
  TaskPriority,
} from '../../../../core/models/task.model';
import { AuthService } from 'frontend/src/app/core/services/auth.service';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css'],
})
export class TaskDialogComponent implements OnInit {

  @Input() task: Task | null = null;
  @Input() taskToEdit: Task | null = null;

  @Input() boardId: string = '';
  @Input() defaultStatus: TaskStatus = TaskStatus.TODO;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<Task>>();
  @Output() delete = new EventEmitter<string>();

  taskForm: FormGroup;
  isSubmitting = signal(false);
  isDeleting = signal(false);
  isEditMode = signal(false);
  deleteConfirm = signal(false);
  currentUserId = signal<string>('');

  TaskPriority = TaskPriority;
  TaskStatus = TaskStatus;

  statuses = Object.values(TaskStatus);
  priorities = Object.values(TaskPriority);

  statusLabels: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'To Do',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.DONE]: 'Done',
  };

  priorityLabels: Record<TaskPriority, string> = {
    [TaskPriority.LOW]: 'Low',
    [TaskPriority.MEDIUM]: 'Medium',
    [TaskPriority.HIGH]: 'High',
  };

  priorityIcons: Record<TaskPriority, string> = {
    [TaskPriority.LOW]: '↓',
    [TaskPriority.MEDIUM]: '→',
    [TaskPriority.HIGH]: '↑',
  };

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      status: [TaskStatus.TODO, Validators.required],
      priority: [TaskPriority.MEDIUM, Validators.required],
      dueDate: [''],
      assigneeId: [''],
    });
  }

  ngOnInit(): void {

    const currentUser = this.authService['currentUserSubject'].value;
    if (currentUser?.id) {
      this.currentUserId.set(currentUser.id);

      if (!this.taskToEdit && !this.task) {
        this.taskForm.patchValue({ assigneeId: currentUser.id });
      }
    }

    const activeTask = this.taskToEdit || this.task;

    if (activeTask) {

      this.isEditMode.set(true);
      this.taskForm.patchValue({
        title: activeTask.title,
        description: activeTask.description || '',
        status: activeTask.status,
        priority: activeTask.priority,
        assigneeId: activeTask.assigneeId || currentUser?.id,
        dueDate: activeTask.dueDate ? new Date(activeTask.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      this.isEditMode.set(false);
      this.taskForm.patchValue({
        status: this.defaultStatus,
        priority: TaskPriority.MEDIUM,
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.taskForm.value;

    const taskData: Partial<Task> = {
      title: formValue.title,
      description: formValue.description || undefined,
      status: formValue.status,
      priority: formValue.priority,
      dueDate: formValue.dueDate
        ? new Date(formValue.dueDate).toISOString()
        : undefined,
      boardId: this.boardId,
      assigneeId: formValue.assigneeId
    };


    this.save.emit(taskData);
  }

  onClose(): void {
    this.deleteConfirm.set(false);
    this.close.emit();
  }



  onDeleteClick(): void {
    this.deleteConfirm.set(true);
  }

  onDeleteCancel(): void {
    this.deleteConfirm.set(false);
  }

  onDeleteConfirm(): void {
    const activeTask = this.taskToEdit || this.task;
    if (!activeTask?.id) return;

    this.isDeleting.set(true);
    this.taskService.deleteTask(activeTask.id, this.boardId).subscribe({
      next: () => {
        this.delete.emit(activeTask.id);
        this.isDeleting.set(false);
        this.deleteConfirm.set(false);
        this.onClose();
      },
      error: (err) => {
        console.error('Error deleting task:', err);
        this.isDeleting.set(false);

      },
    });
  }



  get titleError(): string {
    const control = this.taskForm.get('title');
    if (control?.hasError('required')) return 'Task title is required';
    if (control?.hasError('maxlength')) return 'Title too long (max 200)';
    return '';
  }

  get descriptionError(): string {
    const control = this.taskForm.get('description');
    if (control?.hasError('maxlength')) return 'Description too long (max 1000)';
    return '';
  }

  getCharacterCount(fieldName: string): number {
    return this.taskForm.get(fieldName)?.value?.length || 0;
  }

  getCharacterLimit(fieldName: string): number {
    return fieldName === 'title' ? 200 : 1000;
  }

  getPriorityIcon(): string {
    const priority = this.taskForm.get('priority')?.value as TaskPriority;
    return this.priorityIcons[priority] || 'arrow_forward';
  }
}