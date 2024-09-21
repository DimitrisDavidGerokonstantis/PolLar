import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  styleUrl: 'dialog.component.css',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  isVisible = signal(false); // To show or hide the dialog
  title = input.required<string>();
  manualVisibility = input.required<boolean>();
  type = input.required<'error' | 'classic' | 'healthcheck'>();
  close = output();
  buttonText = input('');
  private router = inject(Router);

  closeDialog(event: Event) {
    if (this.type() !== 'healthcheck') {
      if (this.manualVisibility()) {
        event.preventDefault();
        this.isVisible.set(false);
      } else {
        this.router.navigate(['/main']);
      }
    } else {
      this.close.emit();
    }
  }

  get buttonStyle() {
    if (this.type() === 'error') return '#c97a7a';
    else if (this.type() === 'classic') return '#b0c1b0';
    return '#519d99';
  }

  openDialog(event: Event) {
    event.preventDefault();
    this.isVisible.set(true);
  }
}
