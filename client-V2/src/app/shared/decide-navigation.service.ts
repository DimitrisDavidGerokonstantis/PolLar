import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { EnvService } from './env.service';
import { catchError, map, Observable, of, switchMap, take } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class DecideNavigationService {
  private error = signal('');
  private sharedService = inject(SharedService);
  publicError = this.error.asReadonly();

  constructor(private httpClient: HttpClient, private envService: EnvService) {}

  errorHandling(error: HttpErrorResponse) {
    if (error.status === 0) {
      this.error.set('Server error. Please try again later!');
    } else this.error.set('Uknown error!');
  }

  getParticipantAfterLoginURL(
    role: string,
    number_of_participants: number,
    password: string,
    suggestions_per_participant: number,
    user_id: number
  ): Observable<string[]> {
    return this.httpClient
      .post<string>(this.envService.baseUrl + '/api/participant/pollStatus', {
        numofusers: number_of_participants,
        password: password,
        sugperus: suggestions_per_participant,
        uid: user_id,
      })
      .pipe(
        take(1),
        switchMap((userStatusRes) => {
          return this.httpClient
            .get<{ phase: number }[]>(
              this.envService.baseUrl +
                '/api/participant/getPollPhase/' +
                password
            )
            .pipe(
              take(1),
              switchMap((pollPhaseRes) => {
                return this.getNumberOfUserVotes(password, user_id).pipe(
                  take(1),
                  map((number) => {
                    return this.decideUrlToNavigate(
                      userStatusRes,
                      pollPhaseRes[0].phase,
                      password,
                      user_id,
                      number
                    );
                  })
                );
              }),

              catchError((error: HttpErrorResponse) => {
                this.errorHandling(error);
                return of(['']);
              })
            );
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorHandling(error);
          return of(['']);
        })
      );
  }

  decideUrlToNavigate(
    user_status: string,
    poll_phase: number,
    password: string,
    user_id: number,
    numberOfVotes: number
  ): string[] {
    if (poll_phase === 1) {
      return ['participant', 'suggest', `${password}`];
    } else if (
      poll_phase === 2 &&
      user_status === 'Suggestions has been made but voting not. Poll phase = 2'
    ) {
      return [
        'participant',
        'vote',
        `${password}`,
        (numberOfVotes + 1).toString(),
      ];
    } else if (
      poll_phase === 2 &&
      user_status === 'Suggestions and voting has been made. Poll phase = 2'
    ) {
      return ['participant', 'vote', `${password}`, 'overview'];
    }
    return ['check'];
  }

  getAdminAfterLoginURL(password: string) {
    return ['admin', 'check', password];
  }

  getNumberOfUserVotes(password: string, userID: number) {
    return this.sharedService.getCurrentPollStatus(password).pipe(
      map((res) => {
        let numberOfVotes = 0;
        if (res.votingStatus) {
          res.votingStatus.forEach((voteData) => {
            if (voteData.userId === userID) numberOfVotes = voteData.numOfVotes;
          });
        }
        console.log('NUMBER OF VOTES', numberOfVotes);
        return numberOfVotes;
      })
    );
  }
}
