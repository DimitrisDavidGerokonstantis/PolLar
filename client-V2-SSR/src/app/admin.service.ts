import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';
import { AdminLoginResponse } from './models/admin-login-response.model';
import { FullPollInfo, PollInfo } from './models/create-poll-request.model';
import { EnvService } from './shared/env.service';
import { AddRanksBody } from './models/add-rank.model';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { SharedService } from './shared/shared.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private httpClient: HttpClient,
    private envService: EnvService,
    private sharedService: SharedService
  ) {}
  pollInfo = signal<FullPollInfo>({
    password: '',
    username: '',
    numOfSug: 0,
    numOfPart: 0,
    rank1points: 0,
    rank2points: 0,
    rank3points: 0,
    userNames: [],
    checkboxAllow: false,
    title: '',
    checkboxAllow2: false,
  });
  publicPollInfo = this.pollInfo?.asReadonly();

  generatePassword(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  setPollInfo(info: FullPollInfo) {
    this.pollInfo?.set(info);
    return this.pollInfo!.asReadonly();
  }

  adminLogin(username: string, password: string) {
    return this.httpClient
      .post<AdminLoginResponse[]>(
        'https://pollar-api-rxlv.onrender.com/api/admin/login',
        {
          name: username,
          password: password,
        }
      )
      .pipe(
        map((res) => res[0]),
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

  createPoll(body: PollInfo) {
    return this.httpClient
      .post(this.envService.baseUrl + '/api/admin/createPoll', body)
      .pipe(
        catchError((error) =>
          throwError(() => new Error('Error while creating the Poll'))
        )
      );
  }

  addRanks(body: AddRanksBody) {
    return this.httpClient
      .post(this.envService.baseUrl + '/api/admin/addRanks', body)
      .pipe(
        catchError((error) =>
          throwError(() => new Error('Error while creating the Poll'))
        )
      );
  }

  upgradePhase(password: string, current_phase: number) {
    return this.httpClient
      .post(this.envService.baseUrl + '/api/admin/upgradePhase', {
        password: password,
        phase: current_phase,
      })
      .pipe(
        tap((res) => {
          this.sharedService.setPhase(current_phase + 1);
        }),
        catchError((error) => {
          this.sharedService.setPhase(current_phase);
          return throwError(
            () =>
              new Error('Error when trying to updgrade the phase of the poll!')
          );
        })
      );
  }

  sendEmail(
    title: string,
    to_email: string,
    password: string,
    username: string
  ) {
    emailjs.send(
      'service_vk8oja3',
      'template_6x668um',
      {
        to_email: to_email,
        from_name: 'PolLar',
        title: title,
        password: password,
        username: username,
      },
      'C156t80TNGGNMhUqM'
    );
  }
}
