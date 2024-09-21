import {
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SnackbarService } from '../shared/snackbar.service';
import { ParticipantService } from '../participant-service.service';
import { map, Subscription, tap } from 'rxjs';
import { ErrorComponent } from '../shared/error/error.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { AdminService } from '../admin.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { DecideNavigationService } from '../shared/decide-navigation.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../shared/local-storage.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, ErrorComponent, LoadingSpinnerComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  type = signal('');
  error = signal('');
  // private snackbarService = inject(SnackbarService)
  private participantService = inject(ParticipantService);
  private adminService = inject(AdminService);
  private sharedService = inject(SharedService);
  private navigationService = inject(DecideNavigationService);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);
  navError = this.navigationService.publicError;
  isLoading = signal(false);

  constructor() {
    this.type.set(this.router.url.split('/')[1]);
    this.participantService.resetHasMadeSuggestions();
  }

  form = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required, Validators.maxLength(40)],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
      ],
    }),
    nickname: new FormControl('', {
      validators:
        this.type() === 'participant'
          ? [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(15),
            ]
          : [],
    }),
  });

  enableInputs() {
    this.form.controls.username.enable();
    this.form.controls.nickname.enable();
    this.form.controls.password.enable();
  }

  disableInputs() {
    this.form.controls.username.disable();
    this.form.controls.nickname.disable();
    this.form.controls.password.disable();
  }

  onSubmit() {
    this.isLoading.set(true);
    this.disableInputs();
    if (this.form.invalid) {
      this.error.set('Invalid fields!');
      this.isLoading.set(false);
    } else {
      this.error.set('');
      let { username, password, nickname } = this.form.value;
      let subscription = new Subscription();
      if (this.type() === 'participant' && username && password && nickname)
        subscription = this.participantService
          .joinPoll(username, password, nickname)
          .subscribe({
            next: (res) => {
              this.localStorageService.setLocalStorage(
                'sugperus',
                res[0].sugperus.toString()
              );
              console.log(res);
              this.navigationService
                .getParticipantAfterLoginURL(
                  'user',
                  res[0].numofusers,
                  res[0].password,
                  res[0].sugperus,
                  res[0].uid
                )
                .subscribe({
                  next: (url) => {
                    this.sharedService.setUser(nickname);
                    this.sharedService.setUserType('participant');
                    if (this.localStorageService.window) {
                      this.localStorageService.setLocalStorage(
                        'user',
                        JSON.stringify({
                          username: username,
                          id: res[0].uid,
                          role: 'participant',
                          nickname: nickname,
                        })
                      );
                    }
                    console.log('URL', url);
                    this.router.navigate(url).then(() => {
                      this.isLoading.set(false);
                    });
                  },
                  error: (error) => {
                    console.log(error);
                    this.enableInputs();
                  },
                });
            },
            error: (error) => {
              this.error.set('Server error. Please try again later!');
              this.isLoading.set(false);
              this.enableInputs();
            },
          });
      else if (this.type() === 'admin' && username && password)
        subscription = this.adminService
          .adminLogin(username, password)
          .subscribe({
            next: (res) => {
              this.localStorageService.setLocalStorage(
                'sugperus',
                res.sugperus.toString()
              );
              this.sharedService.setUser(username);
              this.sharedService.setUserType('admin');
              if (this.localStorageService.window) {
                this.localStorageService.setLocalStorage(
                  'user',
                  JSON.stringify({
                    nickname: username,
                    role: 'admin',
                  })
                );
              }
              console.log(res);
              this.router
                .navigate(
                  this.navigationService.getAdminAfterLoginURL(password)
                )
                .then(() => {
                  this.isLoading.set(false);
                  this.form.reset();
                });
            },
            error: (error) => {
              this.error.set(error);
              this.isLoading.set(false);
              this.enableInputs();
            },
          });
      else {
        this.error.set('Invalid Request');
        this.isLoading.set(false);
        this.enableInputs();
      }
    }
  }
}
