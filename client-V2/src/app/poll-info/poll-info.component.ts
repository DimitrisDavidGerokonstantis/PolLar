import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { DownloadInfoComponent } from '../create-poll-form/download-info/download-info.component';
import { OthersSuggestionsComponent } from '../others-suggestions/others-suggestions.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { LoadingPageComponent } from '../shared/loading-page/loading-page.component';
import { SharedService } from '../shared/shared.service';
import { AdminService } from '../admin.service';
import { ErrorComponent } from '../shared/error/error.component';
@Component({
  selector: 'app-poll-info',
  standalone: true,
  imports: [
    DownloadInfoComponent,
    OthersSuggestionsComponent,
    LoadingSpinnerComponent,
    LoadingPageComponent,
    ErrorComponent,
  ],
  templateUrl: './poll-info.component.html',
  styleUrl: './poll-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollInfoComponent implements OnInit {
  private clipboard = inject(Clipboard);
  private sharedService = inject(SharedService);
  private adminService = inject(AdminService);
  current_phase = this.sharedService.current_phase_public;
  phases_description = this.sharedService.phasesDescription;
  password = input.required<string>();
  isLoadingPhaseUpdate = signal(false);
  phaseUpgradeErrorMsg = signal('');
  copied = signal(false);
  pollInfo = signal({
    sugperus: signal('Loading...'),
    numOfUsers: signal('Loading...'),
    phase: signal('Loading...'),
    phaseDescription: signal(''),
    nextPhaseDescription: signal(''),
    usersSuggested: signal(''),
    title: signal('Loading...'),
    totalVotes: signal(0),
    usersVoted: signal(''),
  });

  onCopyPassword() {
    setTimeout(() => {
      this.copied.set(false);
    }, 2000);
    this.clipboard.copy(this.password());
    this.copied.set(true);
  }

  ngOnInit(): void {
    this.sharedService.getPollTitle(this.password()).subscribe({
      next: (res) => {
        this.pollInfo.update((info) => {
          return { ...info, title: signal(res[0].title) };
        });
      },
    });
  }

  onUpgradePhase() {
    this.isLoadingPhaseUpdate.set(true);
    this.adminService
      .upgradePhase(this.password(), +this.pollInfo().phase())
      .subscribe({
        next: (res) => {
          this.isLoadingPhaseUpdate.set(false);
        },
        error: (error) => {
          this.isLoadingPhaseUpdate.set(false);
          this.phaseUpgradeErrorMsg.set(error);
        },
      });
  }

  onGetInfo(info: {
    sugperus: number;
    numOfUsers: number;
    phase: number;
    usersSuggested: number;
    totalVotes: number;
    usersVoted: number;
  }) {
    console.log('INFOOO', info);
    let description = '';
    let nextDescription = '';
    if (info.phase === 1) {
      description = 'Suggestions';
      nextDescription = 'Voting';
    } else if (info.phase === 2) {
      description = 'Voting';
      nextDescription = 'Results';
    } else description = 'Results';

    this.pollInfo.update((pollInfo) => {
      return {
        ...pollInfo,
        sugperus: signal(info.sugperus.toString()),
        phase: signal(info.phase.toString()),
        numOfUsers: signal(info.numOfUsers.toString()),
        phaseDescription: signal(' : ' + description),
        nextPhaseDescription: signal(' : ' + nextDescription),
        usersSuggested: signal(info.usersSuggested.toString() + '/'),
        totalVotes: signal(info.totalVotes),
        usersVoted: signal(info.usersVoted.toString() + '/'),
      };
    });
  }
}
