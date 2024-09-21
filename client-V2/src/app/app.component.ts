import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { CardContainerComponent } from './landing/card-container/card-container.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { SharedService } from './shared/shared.service';
import { LocalStorageService } from './shared/local-storage.service';
import { DialogComponent } from './dialog/dialog.component';
import { ModalComponent } from './shared/health-check/modal/modal.component';
import { DecideNavigationService } from './shared/decide-navigation.service';
import { ErrorComponent } from './shared/error/error.component';

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
    ErrorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private sharedService = inject(SharedService);
  private navService = inject(DecideNavigationService);
  user = this.sharedService.publicUser;
  isOpenModal = signal(false);
  generalError = this.navService.publicError;
  generalError2 = this.sharedService.public_error;

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
