import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import {
  catchError,
  from,
  map,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { LoginResponse } from './models/participant-login-response.model';
import { EnvService } from './shared/env.service';
import { SharedService } from './shared/shared.service';
import { myVotesData, VotingData } from './models/votingData.model';

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  private httpClient = inject(HttpClient);
  private envService = inject(EnvService);
  private sharedService = inject(SharedService);
  private userHasMadeSuggestions = signal(false);
  userHasMadeSuggestionsPublic = this.userHasMadeSuggestions.asReadonly();
  joinPoll(username: string, password: string, nickname: string) {
    return this.httpClient
      .post<LoginResponse[]>(
        this.envService.baseUrl + '/api/participant/login',
        {
          name: username,
          password: password,
          nickname: nickname,
        }
      )
      .pipe(
        catchError((error) => {
          let message = '';
          if (error.status === 0) {
            message = 'Server error. Please try again later!';
          } else {
            message = error.error;
          }
          console.log(error);
          return throwError(() => new Error(message));
        })
      );
  }

  makeSuggestion(poll_password: string, user_id: string, suggestion: string) {
    return this.httpClient
      .post(this.envService.baseUrl + '/api/participant/postSuggestion', {
        password: poll_password,
        suggestion: suggestion,
        uid: user_id,
      })
      .pipe(
        catchError((error) => {
          return throwError(
            () =>
              new Error(
                `Server error when trying to submit the suggestion! ${suggestion}`
              )
          );
        })
      );
  }

  getMySuggestions(user_id: string, password: string): Observable<any> {
    return this.httpClient
      .get(
        this.envService.baseUrl +
          `/api/participant/getSuggestions/${user_id}/${password}`
      )
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error('Error when trying to load your suggestions!')
          );
        })
      );
  }

  updateSuggestion(
    password: string,
    suggestion: string,
    suggestion_id: number,
    user_id: string
  ) {
    console.log('SUGGESTION TO UPDATE', suggestion);
    return this.httpClient
      .put(this.envService.baseUrl + `/api/participant/updateSuggestion`, {
        password: password,
        suggestion: suggestion,
        sugid: suggestion_id,
        uid: user_id,
      })
      .pipe(
        catchError((error) => {
          return throwError(
            new Error('Server error when trying to update your suggestions!')
          );
        })
      );
  }

  setHasMadeSuggestions() {
    this.userHasMadeSuggestions.set(true);
  }

  resetHasMadeSuggestions() {
    this.userHasMadeSuggestions.set(false);
  }

  takeSuggestionsToVote(
    user_id: string,
    password: string,
    rank: '1' | '2' | '3'
  ) {
    return this.httpClient
      .get<VotingData>(
        this.envService.baseUrl +
          `/api/participant/getSuggestionsVote/${user_id}/${password}/${rank}`
      )
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error('Error when trying to fetch voting data!')
          );
        })
      );
  }

  makeVote(
    rank: number,
    userID: number,
    suggestionID: number,
    votedUserID: number
  ) {
    return this.httpClient
      .post(this.envService.baseUrl + '/api/participant/makeVote', {
        rank: rank.toString(),
        uid: userID.toString(),
        vote: suggestionID.toString(),
        voteduser: votedUserID.toString(),
      })
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error('Server error when trying to submit your vote!')
          );
        })
      );
  }

  takeParticipantVotes(userID: string, password: string) {
    return this.httpClient
      .get<myVotesData[]>(
        this.envService.baseUrl +
          `/api/participant/getVotes/${userID}/${password}`
      )
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error('Server error when trying to retrieve your votes!')
          );
        })
      );
  }

  deleteParticipantVotes(userID: string) {
    return this.httpClient
      .delete(
        this.envService.baseUrl + `/api/participant/deleteVotes/${userID}`
      )
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error('Server error when trying to delete your votes!')
          );
        })
      );
  }
}
