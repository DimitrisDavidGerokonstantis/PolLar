import { Component, Output, output } from '@angular/core';

@Component({
  selector: 'app-health-check',
  standalone: true,
  imports: [],
  templateUrl: './health-check.component.html',
  styleUrl: './health-check.component.css',
})
export class HealthCheckComponent {
  open = output();

  onOpen() {
    this.open.emit();
  }
}
