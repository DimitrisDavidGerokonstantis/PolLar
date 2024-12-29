import { Component, inject, input } from '@angular/core';
import { PollInfoComponent } from '../poll-info/poll-info.component';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [PollInfoComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  private adminService = inject(AdminService);
  password = input.required<string>();
}
