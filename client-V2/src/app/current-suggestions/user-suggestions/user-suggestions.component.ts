import { Component, input } from '@angular/core';
import { UserSuggestions } from '../../models/poll-status-results.model';

@Component({
  selector: 'app-user-suggestions',
  standalone: true,
  imports: [],
  templateUrl: './user-suggestions.component.html',
  styleUrl: './user-suggestions.component.css',
})
export class UserSuggestionsComponent {
  userSuggestions = input.required<UserSuggestions>();
  suggestionsPerParticipant = input.required<number>()
}
