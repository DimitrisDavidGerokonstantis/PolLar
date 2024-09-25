import {
  Component,
  inject,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { SharedService } from '../shared/shared.service';
import {
  PollStatusResponse,
  SuggestionsData,
  VotesData,
} from '../models/poll-status-results.model';
import { DialogComponent } from '../dialog/dialog.component';
import { CurrentSuggestionsComponent } from '../current-suggestions/current-suggestions.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { ErrorComponent } from '../shared/error/error.component';
import { LocalStorageService } from '../shared/local-storage.service';
import { EventEmitter } from '@angular/core';
import { CurrentVotesComponent } from '../current-votes/current-votes.component';
import { ResultsComponent } from '../shared/results/results.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-others-suggestions',
  standalone: true,
  imports: [
    CurrentSuggestionsComponent,
    DialogComponent,
    LoadingSpinnerComponent,
    ErrorComponent,
    CurrentVotesComponent,
    ResultsComponent,
    RouterLink,
  ],
  templateUrl: './others-suggestions.component.html',
  styleUrl: './others-suggestions.component.css',
})
export class OthersSuggestionsComponent implements OnInit {
  private sharedService = inject(SharedService);
  private localStorageService = inject(LocalStorageService);
  password = input.required<string>();
  excludedUsers = input<number[]>([]);
  allowToWatchOtherSuggestions = signal(false);
  currentSuggestions = signal<SuggestionsData[]>([]);
  currentVotes = signal<VotesData[]>([]);
  suggestionsPerParticipant = signal(1);
  isLoading = signal<boolean>(false);
  errorMessage = signal('');
  shared_phase = this.sharedService.current_phase_public;
  currentPhase = signal(0);
  numOfUsers = signal(0);
  @Output() infoEmitter: EventEmitter<{
    sugperus: number;
    phase: number;
    numOfUsers: number;
    usersSuggested: number;
    totalVotes: number;
    usersVoted: number;
  }> = new EventEmitter<{
    sugperus: number;
    phase: number;
    numOfUsers: number;
    usersSuggested: number;
    totalVotes: number;
    usersVoted: number;
  }>();
  loadingNavToResults = signal(false);

  onNavToResults() {
    this.loadingNavToResults.set(true);
  }

  ngOnInit(): void {
    this.isLoading.set(true);
    this.sharedService.getCurrentPollStatus(this.password()).subscribe({
      next: (pollStatusResults: PollStatusResponse) => {
        this.currentPhase.set(pollStatusResults.phase);
        this.numOfUsers.set(pollStatusResults.numofusers);
        console.log('INSIDE NEXT', pollStatusResults.phase);
        if (
          pollStatusResults.phase === 1 &&
          pollStatusResults.checkbox &&
          pollStatusResults.suggestionsData
        ) {
          this.allowToWatchOtherSuggestions.set(pollStatusResults!.checkbox);
          this.currentSuggestions.set(pollStatusResults!.suggestionsData);
          console.log('EDW');
          let suggestionPerUser =
            this.localStorageService.getLocalStorage('sugperus');
          if (suggestionPerUser) {
            this.suggestionsPerParticipant.set(+suggestionPerUser);
          }
          console.log('END NEXT');
        } else if (
          pollStatusResults.phase === 2 &&
          pollStatusResults.votingStatus
        ) {
          console.log('VOTING STATUS', pollStatusResults.votingStatus.length);
          this.currentVotes.set(pollStatusResults.votingStatus);
        }
      },
      error: (error) => {
        console.log(error);
        this.errorMessage.set(error);
        this.isLoading.set(false);
      },
      complete: () => {
        console.log('COMPLETE');
        let total_votes = 0;
        this.currentVotes().forEach((voteData) => {
          total_votes += voteData.numOfVotes;
        });
        this.isLoading.set(false);
        console.log('EMIT', {
          sugperus: this.suggestionsPerParticipant(),
          phase: this.currentPhase(),
          numOfUsers: this.numOfUsers(),
          usersSuggested:
            this.currentSuggestions().length / this.suggestionsPerParticipant(),
          totalVotes: total_votes,
          usersVoted: this.currentVotes().length,
        });
        this.infoEmitter.emit({
          sugperus: this.suggestionsPerParticipant(),
          phase: this.currentPhase(),
          numOfUsers: this.numOfUsers(),
          usersSuggested:
            this.currentSuggestions().length / this.suggestionsPerParticipant(),
          totalVotes: total_votes,
          usersVoted: this.currentVotes().length,
        });
      },
    });
  }
}
