import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ParticipantService } from '../participant-service.service';
import { SharedService } from '../shared/shared.service';
import { TransformDataService } from '../shared/transform-data.service';
import { transformedSuggestionsToVoteData } from '../models/votingData.model';
import { ErrorComponent } from '../shared/error/error.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { votesValidator } from './vote.validator';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vote-form',
  standalone: true,
  imports: [ErrorComponent, LoadingSpinnerComponent, ReactiveFormsModule],
  templateUrl: './vote-form.component.html',
  styleUrl: './vote-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoteFormComponent implements OnInit {
  private participantService = inject(ParticipantService);
  private sharedService = inject(SharedService);
  private transformService = inject(TransformDataService);
  private router = inject(Router);
  myID = this.sharedService.public_user_id;
  password = input.required<string>();
  rank = signal<'1' | '2' | '3'>('1');
  suggestionsToVotePerUser = signal<transformedSuggestionsToVoteData>({});
  usersToBeVoted = signal<string[]>([]);
  errorMsg = signal('');
  isLoading = signal(false);
  suggestionsPerUser = signal(0);
  selectedSuggestion = signal<{ id: number; userID: number }>({
    id: 0,
    userID: 0,
  });
  isLoadingSubmission = signal(false);
  submissionErrorMsg = signal('');
  rankDescription = signal('');

  form = new FormGroup(
    {
      options: new FormArray<FormControl>([]),
    },
    { validators: [votesValidator] }
  );

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe({
      next: (param) => {
        this.rank.set(param['rank']);
        this.isLoadingSubmission.set(false);
        this.ngOnInit();
      },
    });
  }

  ngOnInit(): void {
    this.form.controls.options.clear();

    switch (this.rank()) {
      case '2':
        this.rankDescription.set('second');
        break;
      case '3':
        this.rankDescription.set('third');
        break;
      default:
        this.rankDescription.set('');
    }

    this.isLoading.set(true);
    this.participantService
      .takeSuggestionsToVote(this.myID(), this.password(), this.rank())
      .subscribe({
        next: (response) => {
          this.suggestionsToVotePerUser.set(
            this.transformService.transformVotingData(response.mydata)
          );

          this.usersToBeVoted.set(Object.keys(this.suggestionsToVotePerUser()));
          this.suggestionsPerUser.set(
            this.suggestionsToVotePerUser()[this.usersToBeVoted()[0]].length
          );
          for (let userVotes in this.suggestionsToVotePerUser()) {
            this.suggestionsToVotePerUser()[userVotes].forEach(
              (suggestionsList) => {
                this.form.controls.options.push(new FormControl(false));
              }
            );
          }

          console.log(
            this.suggestionsToVotePerUser(),
            this.usersToBeVoted(),
            this.form.controls.options.value
          );
          this.errorMsg.set('');
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMsg.set(error);
          this.isLoading.set(false);
        },
      });
  }

  computeInputID(id1: number, id2: number) {
    let numOfPreviousOptions = 0;
    for (let i = 0; i < id1; i++) {
      numOfPreviousOptions +=
        this.suggestionsToVotePerUser()[this.usersToBeVoted()[i]].length;
    }
    return numOfPreviousOptions + id2;
  }

  onSelectOption(
    index: number,
    suggestion_id: number,
    suggestion_UserId: number
  ) {
    this.form.controls.options.setValue(
      this.form.controls.options.value.map((element, idx) => {
        if (idx === index) return true;
        return false;
      })
    );
    this.selectedSuggestion.set({
      id: suggestion_id,
      userID: suggestion_UserId,
    });
    console.log(index, this.selectedSuggestion());
  }

  onSubmit() {
    this.isLoadingSubmission.set(true);
    console.log(
      'FORM TO SUBMIT',
      this.form.controls.options.value,
      this.selectedSuggestion()
    );
    if (!this.form.invalid) {
      this.participantService
        .makeVote(
          +this.rank(),
          +this.myID(),
          this.selectedSuggestion().id,
          this.selectedSuggestion().userID
        )
        .subscribe({
          next: (res) => {
            this.submissionErrorMsg.set('');
          },
          error: (error) => {
            this.isLoadingSubmission.set(false);
            this.submissionErrorMsg.set(error);
          },
          complete: () => {
            if (+this.rank() < 3)
              this.router.navigate([
                'participant',
                'vote',
                this.password(),
                `${+this.rank() + 1}`,
              ]);
            else
              this.router.navigate([
                'participant',
                'vote',
                this.password(),
                'overview',
              ]);
          },
        });
    }
  }
}
