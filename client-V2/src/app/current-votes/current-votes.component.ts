import { Component, input } from '@angular/core';
import { VotesData } from '../models/poll-status-results.model';

@Component({
  selector: 'app-current-votes',
  standalone: true,
  imports: [],
  templateUrl: './current-votes.component.html',
  styleUrl: './current-votes.component.css',
})
export class CurrentVotesComponent {
  currentVotes = input.required<VotesData[]>();
}
