import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { CardContainerComponent } from './landing/card-container/card-container.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { SharedService } from './shared/shared.service';
import { LocalStorageService } from './shared/local-storage.service';
import { DialogComponent } from './dialog/dialog.component';
import { ModalComponent } from './shared/health-check/modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    CardContainerComponent,
    LoadingSpinnerComponent,
    DialogComponent,
    ModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private sharedService = inject(SharedService);
  user = this.sharedService.publicUser;
  isOpenModal = signal(false);

  openHealthCheckModal() {
    this.isOpenModal.set(true);
  }

  closeHealthCheckModal() {
    this.isOpenModal.set(false);
  }

  ngOnInit(): void {
    this.sharedService.checkAndInitializeUser().subscribe({});
  }
}
