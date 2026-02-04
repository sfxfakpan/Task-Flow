import { Component, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  activeTab: 'login' | 'register' = 'login';
  email = '';
  password = '';
  submitted = signal(false);
  fieldErrors = signal<{ email?: string; password?: string; general?: string }>({});

  setActiveTab(tab: 'login' | 'register') {
    this.activeTab = tab;

    if (tab === 'login') {
      this.router.navigate(['/login']);
    }

    if (tab === 'register') {
      this.router.navigate(['/register']);
    }
  }

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  submit() {
    this.submitted.set(true);
    this.fieldErrors.set({});

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.submitted.set(false);
        const payload = err?.error ?? null;

        if (payload?.statusCode === 401 || payload?.message === 'Invalid credentials') {
          this.fieldErrors.set({ general: payload?.message || 'Invalid credentials' });
        } else if (payload?.message) {
          this.fieldErrors.set({ general: payload.message });
        } else {
          this.fieldErrors.set({ general: 'Login failed. Please try again.' });
        }
      },
    });
  }
}
