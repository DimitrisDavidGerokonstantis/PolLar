import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ParticipantService } from '../participant-service.service';
import { SharedService } from '../shared/shared.service';
import { myVotesData } from '../models/votingData.model';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { LoadingPageComponent } from '../shared/loading-page/loading-page.component';
import { ErrorComponent } from '../shared/error/error.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-votes-overview',
  standalone: true,
  imports: [ErrorComponent, LoadingPageComponent, LoadingSpinnerComponent],
  templateUrl: './votes-overview.component.html',
  styleUrl: './votes-overview.component.css',
})
export class VotesOverviewComponent implements OnInit {
  private participantService = inject(ParticipantService);
  private sharedService = inject(SharedService);
  private router = inject(Router);
  password = input.required<string>();
  updateAble = input.required<boolean>();
  isLoadingVotes = signal(false);
  fetchingVotesError = signal('');
  myVotes = signal<myVotesData[]>([]);
  isLoadingDeleteVotes = signal(false);
  deleteVotesError = signal('');
  votesWereDelete = signal(false);
  ngOnInit(): void {
    this.isLoadingVotes.set(true);
    this.participantService
      .takeParticipantVotes(
        this.sharedService.public_user_id(),
        this.password()
      )
      .subscribe({
        next: (res) => {
          this.myVotes.set(res);
        },
        error: (error) => {
          this.isLoadingVotes.set(false);
          this.fetchingVotesError.set(error);
        },
        complete: () => {
          this.fetchingVotesError.set('');
          this.isLoadingVotes.set(false);
        },
      });
  }

  onEdit() {
    const wantToEdit = window.confirm(
      'Do you really want to edit your votes ? All your previous votes wil be deleted and you will be asked to vote again.'
    );
    if (wantToEdit) {
      this.isLoadingDeleteVotes.set(true);
      this.participantService
        .deleteParticipantVotes(this.sharedService.public_user_id())
        .subscribe({
          next: (res) => {
            this.isLoadingDeleteVotes.set(false);
            this.deleteVotesError.set('');
          },
          error: (error) => {
            this.deleteVotesError.set(error);
            this.isLoadingDeleteVotes.set(false);
          },
          complete: () => {
            this.votesWereDelete.set(true);
            this.router.navigate(['participant', 'vote', this.password(), '1']);
          },
        });
    }
  }
}
