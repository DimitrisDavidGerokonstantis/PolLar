import { Component, OnInit, signal } from '@angular/core';
import { SharedService } from '../../shared.service';
import { sign } from 'crypto';
import { ErrorComponent } from '../../error/error.component';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [LoadingSpinnerComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements OnInit {
  errorMsg = signal('');
  successMsg = signal('');
  status = signal('');

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.status.set("Testing server's health...");
    this.sharedService.getPollTitle('siwqy007').subscribe({
      error: (error) => {
        this.status.set('Finished healthchecking');
        this.errorMsg.set('Server is currently down!');
        this.successMsg.set('');
      },
      complete: () => {
        this.status.set('Finished healthchecking');
        this.errorMsg.set('');
        this.successMsg.set('Server is up and running!');
      },
    });
  }
}
