import { Injectable } from '@angular/core';
import {
  SuggestionsData,
  UserSuggestions,
} from '../models/poll-status-results.model';

@Injectable({
  providedIn: 'root',
})
export class TransformDataService {
  transformCurrentSuggestionsData(
    currentSuggestions: SuggestionsData[],
    suggestionsPerParticipant: number
  ) : UserSuggestions[] {
    let suggestionsPerUser: UserSuggestions[] = [];

    for (
      let i = 0;
      i < currentSuggestions.length / suggestionsPerParticipant;
      i++
    ) {
      let currentUserSuggestions: string[] = [];
      let current_rank = 1;
      let current_user = 0;
      let current_user_name = '';
      for (
        let j = i * suggestionsPerParticipant;
        j < i * suggestionsPerParticipant + suggestionsPerParticipant;
        j++
      ) {
        currentUserSuggestions.push(currentSuggestions[j].suggestion);
        current_rank += 1;
        current_user = currentSuggestions[j].user_id;
        current_user_name = currentSuggestions[j].nickname;
      }
      suggestionsPerUser.push({
        user: current_user,
        suggestions: currentUserSuggestions,
        name: current_user_name
      });
    }
    return suggestionsPerUser;
  }
}
