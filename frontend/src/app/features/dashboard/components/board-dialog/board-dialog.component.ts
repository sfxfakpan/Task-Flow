import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-board-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './board-dialog.component.html',
  styleUrls: ['./board-dialog.component.css']
})
export class BoardDialogComponent implements OnInit {

  @Input() boardData: any = null;


  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ name: string; description: string }>();

  boardForm: FormGroup;
  isEditMode = signal(false);
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder) {

    this.boardForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit() {

    if (this.boardData) {
      this.isEditMode.set(true);
      this.boardForm.patchValue({
        name: this.boardData.name,
        description: this.boardData.description
      });
    }
  }


  hasError(field: string, error: string) {
    const control = this.boardForm.get(field);
    return control?.hasError(error) && control?.touched;
  }

  onSubmit() {
    if (this.boardForm.valid) {
      this.isSubmitting.set(true);

      setTimeout(() => {
        this.save.emit(this.boardForm.value);
        this.isSubmitting.set(false);
      }, 500);
    } else {
      this.boardForm.markAllAsTouched();
    }
  }
}