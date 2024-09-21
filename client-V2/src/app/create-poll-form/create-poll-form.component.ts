import {
  Component,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  minimumParticipants,
  participantsSuggestionsRelation,
} from './custom.validators';
import { ErrorComponent } from '../shared/error/error.component';
import { RandomUsernamesService } from '../shared/random-usernames.service';
import { AdminService } from '../admin.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { DownloadInfoComponent } from './download-info/download-info.component';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-create-poll-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ErrorComponent,
    LoadingSpinnerComponent,
    DownloadInfoComponent,
    DialogComponent,
  ],
  templateUrl: './create-poll-form.component.html',
  styleUrl: './create-poll-form.component.css',
})
export class CreatePollFormComponent {
  private randomUsernamesService = inject(RandomUsernamesService);
  private adminService = inject(AdminService);
  isLoading = signal(false);
  isSubmitted = signal(false);
  createPollError = signal('');
  isPollCreated = signal(false);
  usernames: WritableSignal<string[]> = signal([]);
  pollInfo = this.adminService.publicPollInfo;
  invitationsSent = signal<boolean[]>([]);

  form = new FormGroup({
    title: new FormControl(null, {
      validators: [Validators.required, Validators.maxLength(70)],
    }),
    username: new FormControl(null, {
      validators: [Validators.required, Validators.maxLength(10)],
    }),
    participantsConfig: new FormGroup(
      {
        numOfParticipants: new FormControl(null, {
          validators: [Validators.required, Validators.min(2)],
        }),
        suggestionsPerParticipant: new FormControl(null, {
          validators: [Validators.required, Validators.min(1)],
        }),
        checkbox1: new FormControl(false),
        checkbox2: new FormControl(false),
      },
      {
        validators: [minimumParticipants, participantsSuggestionsRelation],
      }
    ),
    matchingConfig: new FormGroup({
      ranking1: new FormControl(null, {
        validators: [Validators.required],
      }),
      ranking2: new FormControl(null, {
        validators: [Validators.required],
      }),
      ranking3: new FormControl(null, {
        validators: [Validators.required],
      }),
    }),
    usernames: new FormArray<FormControl>([]),
  });

  generateUsernames() {
    this.usernames.set([]);
    if (this.form.controls.participantsConfig.value.numOfParticipants) {
      for (
        let i = 0;
        i < this.form.controls.participantsConfig.value.numOfParticipants;
        i++
      ) {
        this.usernames.update((oldUsernames) => [
          ...oldUsernames,
          this.randomUsernamesService.generateUsername(),
        ]);
        this.invitationsSent.update((oldInvitations) => {
          return [...oldInvitations, false];
        });
      }
    }
    this.form.controls.usernames.clear();
    this.usernames().forEach((username) => {
      this.form.controls.usernames.push(
        new FormControl('email@example.com', {
          validators: [Validators.email, Validators.required],
        })
      );
    });
  }

  // ngOnInit() {
  //   if(!this.form.invalid)
  //    this.createPollError.set('');
  // }

  onSubmit() {
    this.isSubmitted.set(true);
    if (!this.form.invalid) {
      this.generateUsernames();
      this.adminService.setPollInfo({
        title: this.form.controls.title.value
          ? this.form.controls.title.value
          : '',
        password: this.adminService.generatePassword(),
        numOfPart: this.form.controls.participantsConfig.controls
          .numOfParticipants.value
          ? this.form.controls.participantsConfig.controls.numOfParticipants
              .value
          : 0,
        numOfSug: this.form.controls.participantsConfig.controls
          .suggestionsPerParticipant.value
          ? this.form.controls.participantsConfig.controls
              .suggestionsPerParticipant.value
          : 0,
        rank1points: this.form.controls.matchingConfig.controls.ranking1.value
          ? this.form.controls.matchingConfig.controls.ranking1.value
          : 0,
        rank2points: this.form.controls.matchingConfig.controls.ranking2.value
          ? this.form.controls.matchingConfig.controls.ranking2.value
          : 0,
        rank3points: this.form.controls.matchingConfig.controls.ranking3.value
          ? this.form.controls.matchingConfig.controls.ranking3.value
          : 0,
        checkboxAllow: this.form.controls.participantsConfig.controls.checkbox1
          .value
          ? this.form.controls.participantsConfig.controls.checkbox1.value
          : false,
        checkboxAllow2: this.form.controls.participantsConfig.controls.checkbox2
          .value
          ? this.form.controls.participantsConfig.controls.checkbox2.value
          : false,
        username: this.form.controls.username.value
          ? this.form.controls.username.value
          : '',
        userNames: this.usernames(),
      });

      this.isLoading.set(true);
      for (let i = 0; i < this.pollInfo().numOfPart; i++)
        this.adminService
          .createPoll({
            numOfPart: this.pollInfo().numOfPart,
            numOfSug: this.pollInfo().numOfSug,
            checkboxAllow: this.pollInfo().checkboxAllow,
            checkboxAllow2: this.pollInfo().checkboxAllow2,
            password: this.pollInfo().password,
            rank1points: this.pollInfo().rank1points,
            rank2points: this.pollInfo().rank2points,
            rank3points: this.pollInfo().rank3points,
            title: this.pollInfo().title,
            userName: this.pollInfo().userNames[i],
            username: this.pollInfo().username,
          })
          .subscribe({
            next: (res) => {
              if (i === this.pollInfo().numOfPart - 1)
                this.adminService
                  .addRanks({
                    password: this.pollInfo().password,
                    rank1points: this.pollInfo().rank1points,
                    rank2points: this.pollInfo().rank2points,
                    rank3points: this.pollInfo().rank3points,
                  })
                  .subscribe({
                    next: (res) => this.createPollError.set(''),
                    error: (error) => {
                      this.createPollError.set('Error on creating the poll');
                      this.isLoading.set(false);
                    },
                    complete: () => {
                      this.isLoading.set(false);
                      this.isPollCreated.set(true);
                    },
                  });
            },
            error: (error) => {
              this.createPollError.set('Server error. Please try again later!');
              this.isLoading.set(false);
            },
          });
    } else {
      this.createPollError.set('Invalid or missing values!');
    }
  }

  // onReset(){
  //   this.isSubmitted.set(false)
  // }

  onSendInvitation(event: Event, userIndex: number, username: string) {
    event.preventDefault();
    this.invitationsSent.update((oldInvitations) => {
      oldInvitations[userIndex] = true;
      return [...oldInvitations];
    });
    this.adminService.sendEmail(
      this.pollInfo().title,
      this.form.controls.usernames.value[userIndex],
      this.pollInfo().password,
      username
    );
    console.log(
      this.form.controls.usernames.value[userIndex],
      this.form.controls.usernames,
      username,
      this.pollInfo().password,
      this.pollInfo().title
    );
  }
}
