import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'frontend/src/app/core/models/user.model';
import { AuthService } from 'frontend/src/app/core/services/auth.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './nav-bar.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class NavbarComponent {

  user$!: Observable<User | null>;
  dropdownOpen = false;
  hasNotifications = true;


  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.user$ = this.authService.currentUser$;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  logout() {
    this.authService.logout();
  }
}
