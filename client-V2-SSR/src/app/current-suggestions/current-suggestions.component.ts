import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  SuggestionsData,
  UserSuggestions,
} from '../models/poll-status-results.model';
import { UserSuggestionsComponent } from './user-suggestions/user-suggestions.component';
import { TransformDataService } from '../shared/transform-data.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-current-suggestions',
  standalone: true,
  imports: [UserSuggestionsComponent, LoadingSpinnerComponent],
  templateUrl: './current-suggestions.component.html',
  styleUrl: './current-suggestions.component.css',
})
export class CurrentSuggestionsComponent implements OnInit {
  suggestionsPerParticipant = input.required<number>();
  currentSuggestions = input.required<SuggestionsData[]>();
  currentSuggestionsPerUser = signal<UserSuggestions[]>([]);
  excludedUsers = input<number[]>([]);
  private transformService = inject(TransformDataService);

  ngOnInit() {
    this.currentSuggestionsPerUser.set(
      this.transformService.transformCurrentSuggestionsData(
        this.currentSuggestions(),
        this.suggestionsPerParticipant()
      )
    );
  }
}
