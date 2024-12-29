import { Component, inject, input, OnInit, signal } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import {
  PollStatusResponse,
  SuggestionsData,
} from '../models/poll-status-results.model';
import { LoadingPageComponent } from '../shared/loading-page/loading-page.component';
import { ErrorComponent } from '../shared/error/error.component';
import { DialogComponent } from '../dialog/dialog.component';
import { CurrentSuggestionsComponent } from '../current-suggestions/current-suggestions.component';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ParticipantService } from '../participant-service.service';
import { Router, RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { OthersSuggestionsComponent } from '../others-suggestions/others-suggestions.component';
import { LocalStorageService } from '../shared/local-storage.service';
import { TransformDataService } from '../shared/transform-data.service';

@Component({
  selector: 'app-make-suggestions-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrentSuggestionsComponent,
    LoadingPageComponent,
    ErrorComponent,
    DialogComponent,
    LoadingSpinnerComponent,
    OthersSuggestionsComponent,
    RouterOutlet,
  ],
  templateUrl: './make-suggestions-form.component.html',
  styleUrl: './make-suggestions-form.component.css',
})
export class MakeSuggestionsFormComponent implements OnInit {
  private sharedService = inject(SharedService);
  private participantService = inject(ParticipantService);
  private router = inject(Router);
  private localStorageService = inject(LocalStorageService);
  private transformService = inject(TransformDataService);
  me = this.sharedService.public_user_id;
  password = input.required<string>();
  allowToWatchOtherSuggestions = signal(false);
  currentSuggestions = signal<SuggestionsData[]>([]);
  suggestionsPerParticipant = signal(0);
  isLoading = signal<boolean>(false);
  errorMessage = signal('');
  isLoadingSubmission = signal(false);
  disabledEdit = signal(false);
  title = signal('Loading title ...');
  mySuggestions = signal<
    { id: number; suggestion: string; userid: number; ppwd: string }[]
  >([]);
  hasMadeSuggestions = this.participantService.userHasMadeSuggestionsPublic;

  form = new FormGroup({
    suggestions: new FormArray<FormControl>([]),
  });

  ngOnInit(): void {
    this.isLoading.set(true);
    this.participantService
      .getMySuggestions(this.sharedService.public_user_id(), this.password())
      .subscribe({
        next: (res) => {
          if (res.data.length > 0)
            this.participantService.setHasMadeSuggestions();
          this.mySuggestions.set(res.data);
          this.sharedService.getCurrentPollStatus(this.password()).subscribe({
            next: (pollStatusResults: PollStatusResponse) => {
              if (
                pollStatusResults.checkbox &&
                pollStatusResults.suggestionsData
              ) {
                this.allowToWatchOtherSuggestions.set(
                  pollStatusResults.checkbox
                );
                this.currentSuggestions.set(pollStatusResults.suggestionsData);
              }
              let suggestionPerUser =
                this.localStorageService.getLocalStorage('sugperus');
              if (suggestionPerUser) {
                this.suggestionsPerParticipant.set(+suggestionPerUser);
              }
            },
            error: (error) => {
              console.log(error);
              this.isLoading.set(false);
              this.errorMessage.set(error);
            },
            complete: () => {
              this.isLoading.set(false);
              console.log(this.sharedService.public_user_id());
              for (let i = 0; i < this.suggestionsPerParticipant(); i++) {
                this.form.controls.suggestions.push(
                  new FormControl(
                    {
                      value: this.hasMadeSuggestions()
                        ? this.mySuggestions()[i].suggestion
                        : '<to be added>',
                      disabled: this.hasMadeSuggestions(),
                    },
                    {
                      validators: [
                        Validators.required,
                        Validators.maxLength(42),
                      ],
                    }
                  )
                );
              }

              this.sharedService.getPollTitle(this.password()).subscribe({
                next: (res) => {
                  this.title.set(res[0].title);
                },
                error: (error) => {
                  this.isLoading.set(false);
                  this.errorMessage.set(error);
                },
              });
            },
          });
        },
        error: (error) => this.errorMessage.set(error),
      });
  }

  isTheSameSuggestion(index: number) {
    return (
      this.form.controls.suggestions.getRawValue()[index] ===
      this.mySuggestions()[index].suggestion
    );
  }

  onEditSuggestion(index: number, event: Event) {
    event.preventDefault();
    this.form.controls.suggestions.at(index).enable();
    for (let i = 0; i < this.suggestionsPerParticipant(); i++) {
      if (i !== index) {
        this.onFinishEdit(i, null);
        this.disabledEdit.set(true);
      }
    }
  }

  onFinishEdit(index: number, event: Event | null) {
    if (
      event !== null &&
      this.form.controls.suggestions.value[index] ===
        this.mySuggestions()[index].suggestion
    ) {
      event.preventDefault();
    }
    // console.log(
    //   this.form.controls.suggestions.value[index] ===
    //     this.mySuggestions()[index].suggestion,
    //   'SAME',
    //   this.form.controls.suggestions.value[index],
    //   this.mySuggestions()[index].suggestion
    // );
    this.disabledEdit.set(false);
    this.form.controls.suggestions.at(index).disable();
  }

  onFinishEditWithoutSubmit(index: number, event: Event) {
    event.preventDefault();
    this.form.controls.suggestions
      .at(index)
      .setValue(this.mySuggestions()[index].suggestion);
    this.disabledEdit.set(false);
    this.onFinishEdit(index, null);
  }

  readyToUpdate() {
    for (let i = 0; i < this.suggestionsPerParticipant(); i++) {
      if (this.form.controls.suggestions.at(i).enabled) return false;
    }
    return true;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage.set('Invalid fields!');
      console.log('INVALID FORM');
    } else if (!this.hasMadeSuggestions()) {
      this.isLoadingSubmission.set(true);
      console.log(
        'FORM NO SUGGESTIONS: ',
        this.form.controls.suggestions.value
      );
      let suggestionsSubmitted = 0;

      this.form.controls.suggestions.value.forEach((suggestion) => {
        if (!this.errorMessage()) {
          this.participantService
            .makeSuggestion(
              this.password(),
              this.sharedService.public_user_id(),
              suggestion
            )
            .subscribe({
              complete: () => {
                suggestionsSubmitted += 1;
                if (suggestionsSubmitted === this.suggestionsPerParticipant()) {
                  this.participantService.setHasMadeSuggestions();
                  this.router.navigate([
                    'participant',
                    'suggest',
                    this.password(),
                  ]);
                  for (let i = 0; i < this.suggestionsPerParticipant(); i++) {
                    this.onFinishEdit(i, null);
                  }
                  this.participantService
                    .getMySuggestions(
                      this.sharedService.public_user_id(),
                      this.password()
                    )
                    .subscribe({
                      next: (res) => this.mySuggestions.set(res.data),
                    });
                  this.isLoadingSubmission.set(false);
                  // this.ngOnInit()
                }
              },
              error: (error) => {
                this.errorMessage.set(error);
                this.isLoadingSubmission.set(false);
              },
            });
        }
      });
    } else {
      this.isLoadingSubmission.set(true);
      console.log(
        'FORM YES SUGGESTIONS: ',
        this.form.controls.suggestions.value
      );
      let suggestionsUpdated = 0;
      this.form.controls.suggestions.value.forEach((suggestion, index) => {
        console.log(index);
        this.participantService
          .updateSuggestion(
            this.password(),
            this.form.controls.suggestions.value[index],
            this.mySuggestions()[index].id,
            this.sharedService.public_user_id()
          )
          .subscribe({
            complete: () => {
              for (let i = 0; i < this.suggestionsPerParticipant(); i++) {
                this.onFinishEdit(i, null);
              }
              suggestionsUpdated += 1;
              if (suggestionsUpdated === this.suggestionsPerParticipant()) {
                this.participantService.setHasMadeSuggestions();
                this.router.navigate([
                  'participant',
                  'suggest',
                  this.password(),
                ]);
                this.isLoadingSubmission.set(false);
              }
              this.participantService
                .getMySuggestions(
                  this.sharedService.public_user_id(),
                  this.password()
                )
                .subscribe({
                  next: (res) => this.mySuggestions.set(res.data),
                });
            },
            error: (error) => {
              this.errorMessage.set(error);
              this.isLoadingSubmission.set(false);
            },
          });
      });
    }
  }
}
