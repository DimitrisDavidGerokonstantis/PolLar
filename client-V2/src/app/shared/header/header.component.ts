import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { HealthCheckComponent } from '../health-check/health-check.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    HealthCheckComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  text = input.required();
  type = input.required<'header' | 'footer'>();
  openHealthCheck = output();

  onOpenHealthCheck() {
    this.openHealthCheck.emit();
  }

  style = computed(() =>
    this.type() === 'footer' ? { position: 'fixed', bottom: 0 } : {}
  );
}
