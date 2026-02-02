import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  activeTab: 'login' | 'register' = 'register';

  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  setActiveTab(tab: 'login' | 'register') {
    this.activeTab = tab;

    if (tab === 'login') {
      this.router.navigate(['/login']);
    }

    if (tab === 'register') {
      this.router.navigate(['/register']);
    }
  }

  registerForm = this.formBuilder.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator },
  );

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return `${fieldName} is required`;
    if (control.errors['minlength']) {
      const minLength = control.errors['minlength'].requiredLength;
      return `${fieldName} must be at least ${minLength} characters`;
    }
    if (control.errors['email']) return 'Please enter a valid email';
    return '';
  }

  submit() {
    if (this.registerForm.invalid) return;

    const { firstName, lastName, email, password } = this.registerForm.value;
    this.auth
      .register({
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        password: password || '',
      })
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => console.log(err.error.message),
      });
  }
}
