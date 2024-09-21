import { computed, inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { catchError, map, of, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EnvService } from './env.service';
import { PollStatusResponse } from '../models/poll-status-results.model';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private localStorageService = inject(LocalStorageService);
  private httpClient = inject(HttpClient);
  private envService = inject(EnvService);
  user = signal('');
  user_type = signal<'participant' | 'admin' | null | undefined>(undefined);
  publicUser = this.user.asReadonly();
  publicUserType = this.user_type.asReadonly();
  user_id = signal('');
  public_user_id = this.user_id.asReadonly();
  private currentPhase = signal(0);
  current_phase_public = this.currentPhase.asReadonly();

  setPhase(phase: number) {
    this.currentPhase.set(phase);
  }

  get phasesDescription() {
    return computed(() => {
      console.log(this.currentPhase());
      if (this.currentPhase() === 1) return ['Suggestions', 'Voting'];
      else if (this.currentPhase() === 2) return ['Voting', 'Results'];
      else if (this.currentPhase() === 3) return ['Results', 'None'];
      else return ['Loading...', 'Loading...'];
    });
  }

  setUser(username: string) {
    this.user.set(username);
  }

  setUserType(type: 'participant' | 'admin' | null | undefined) {
    this.user_type.set(type);
  }

  setUserID(id: string) {
    this.user_id.set(id);
  }

  checkAndInitializeUser() {
    if (this.localStorageService.window) {
      console.log('USER INIT');
      let loadedUser = this.localStorageService.getLocalStorage('user');
      if (loadedUser) {
        console.log('NOT NULL USER');
        this.setUser(JSON.parse(loadedUser).nickname);
        this.setUserType(JSON.parse(loadedUser).role);
        this.setUserID(JSON.parse(loadedUser).id);
        return of(JSON.parse(loadedUser).role);
      } else {
        console.log('NULL USER');
        this.setUserType(null);
        return of(null);
      }
    }
    return of('loading');
  }

  getCurrentPollStatus(password: string) {
    return this.httpClient
      .post<PollStatusResponse>(
        this.envService.baseUrl + '/api/common/pollStatus',
        {
          password: password,
        }
      )
      .pipe(
        tap((res) => {
          this.setPhase(res.phase);
        }),

        catchError((error) => {
          return throwError(
            () =>
              new Error(
                'Server error while trying to retrieve the current status of the poll!'
              )
          );
        })
      );
  }

  getPollTitle(password: string) {
    return this.httpClient
      .get<{ title: string }[]>(
        this.envService.baseUrl + `/api/participant/getPollTitle/${password}`
      )
      .pipe(
        catchError((error) => {
          return throwError(
            () =>
              new Error(
                'Server error when trying to get the title of the poll!'
              )
          );
        })
      );
  }
}
