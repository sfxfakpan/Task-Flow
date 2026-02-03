import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './features/dashboard/components/nav-bar/nav-bar.component';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
   standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'frontend';
}
