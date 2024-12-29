import { Component, inject, input, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { SharedService } from '../../shared/shared.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { LocalStorageService } from '../../shared/local-storage.service';

@Component({
  selector: 'app-card-container',
  standalone: true,
  imports: [CardComponent, DialogComponent],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.css',
})
export class CardContainerComponent implements OnInit {
  private sharedService = inject(SharedService);
  private localStorageService = inject(LocalStorageService);
  auth = input();
  phaseInvalid = input()

  ngOnInit(): void {
    if (this.localStorageService.window) {
      this.localStorageService.clearLocalStorage();
      this.sharedService.setUser('');
      console.log(this.auth());
    }
  }
}
