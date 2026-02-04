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

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css'],
})
export class TaskDialogComponent implements OnInit {
  @Input() task: Task | null = null;
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

  statuses = Object.values(TaskStatus);
  priorities = Object.values(TaskPriority);

  TaskPriority = TaskPriority;
  TaskStatus = TaskStatus;

  statusLabels: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'TODO',
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
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      status: [TaskStatus.TODO, Validators.required],
      priority: [TaskPriority.MEDIUM, Validators.required],
      dueDate: [''],
    });
  }

  ngOnInit(): void {
    if (this.task) {
      this.isEditMode.set(true);
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description || '',
        status: this.task.status,
        priority: this.task.priority,
        dueDate: this.task.dueDate ? this.task.dueDate.split('T')[0] : '',
      });
    } else {
      this.taskForm.patchValue({
        status: this.defaultStatus,
        priority: TaskPriority.MEDIUM,
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      Object.keys(this.taskForm.controls).forEach((key) => {
        this.taskForm.get(key)?.markAsTouched();
      });
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

  onDeleteConfirm(): void {
    if (!this.task?.id) return;

    this.isDeleting.set(true);
    this.taskService.deleteTask(this.task.id, this.boardId).subscribe({
      next: () => {
        this.delete.emit(this.task!.id);
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

  onDeleteCancel(): void {
    this.deleteConfirm.set(false);
  }

  get titleError(): string {
    const titleControl = this.taskForm.get('title');
    if (titleControl?.hasError('required')) {
      return 'Task title is required';
    }
    if (titleControl?.hasError('maxlength')) {
      return 'Task title must be less than 200 characters';
    }
    return '';
  }

  get descriptionError(): string {
    const descControl = this.taskForm.get('description');
    if (descControl?.hasError('maxlength')) {
      return 'Description must be less than 1000 characters';
    }
    return '';
  }

  getCharacterCount(fieldName: string): number {
    return this.taskForm.get(fieldName)?.value?.length || 0;
  }

  getCharacterLimit(fieldName: string): number {
    const limits: Record<string, number> = {
      title: 200,
      description: 1000,
    };
    return limits[fieldName] || 0;
  }

  getPriorityColor(priority: TaskPriority): string {
    const colors: Record<TaskPriority, string> = {
      [TaskPriority.LOW]: '#10b981',
      [TaskPriority.MEDIUM]: '#f59e0b',
      [TaskPriority.HIGH]: '#ef4444',
    };
    return colors[priority];
  }

  getPriorityIcon(): string {
    const priority = this.taskForm.get('priority')?.value as TaskPriority;
    return this.priorityIcons[priority] || '→';
  }
}
