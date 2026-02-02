import { Route } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';


export const appRoutes: Route[] = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
];
