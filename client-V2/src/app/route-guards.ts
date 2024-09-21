import {
  CanDeactivateFn,
  CanMatchFn,
  RedirectCommand,
  Router,
} from '@angular/router';
import { CreatePollFormComponent } from './create-poll-form/create-poll-form.component';
import { inject } from '@angular/core';
import { SharedService } from './shared/shared.service';
import { map, take } from 'rxjs';

// export const canMatchParticipantPaths: CanMatchFn = (route, segments) => {
//   const router = inject(Router);
//   const sharedService = inject(SharedService);
//   console.log(segments);
//   return sharedService.checkAndInitializeUser().pipe(
//     take(1),
//     map((result) => {
//       if (result === 'participant') return true;
//       if (result === 'loading')
//         return new RedirectCommand(router.parseUrl('/loading'));
//       return new RedirectCommand(router.parseUrl('?auth=true'));
//     })
//   );
// };

// export const canMatchAdminPaths: CanMatchFn = (route, segments) => {
//   const router = inject(Router);
//   const sharedService = inject(SharedService);
//   console.log(segments);
//   return sharedService.checkAndInitializeUser().pipe(
//     take(1),
//     map((result) => {
//       if (result === 'admin') return true;
//       if (result === 'loading')
//         return new RedirectCommand(router.parseUrl('/loading'));
//       return new RedirectCommand(router.parseUrl('?auth=true'));
//     })
//   );
// };

// export const canMatchPhase1Paths: CanMatchFn = (route, segments) => {
//   const router = inject(Router);
//   const sharedService = inject(SharedService);
//   return sharedService.getCurrentPollStatus(segments[1].path).pipe(
//     take(1),
//     map((result) => {
//       if (result.phase === 1) return true;
//       return new RedirectCommand(router.parseUrl('?phaseInvalid=true'));
//     })
//   );
// };

export const canMatchRoleSpecificPaths = (role: 'participant' | 'admin') => {
  const canMatchFN: CanMatchFn = (route, segments) => {
    const router = inject(Router);
    const sharedService = inject(SharedService);
    console.log(segments);
    return sharedService.checkAndInitializeUser().pipe(
      take(1),
      map((result) => {
        if (result === role) return true;
        if (result === 'loading')
          return new RedirectCommand(router.parseUrl('/loading'));
        return new RedirectCommand(router.parseUrl('?auth=true'));
      })
    );
  };
  return canMatchFN;
};

export const canMatchPhaseSpecificPaths = (phase: 1 | 2 | 3) => {
  const canMatchPhase1Paths: CanMatchFn = (route, segments) => {
    const router = inject(Router);
    const sharedService = inject(SharedService);
    return sharedService.getCurrentPollStatus(segments[1].path).pipe(
      take(1),
      map((result) => {
        if (result.phase === phase) return true;
        return new RedirectCommand(router.parseUrl('?phaseInvalid=true'));
      })
    );
  };
  return canMatchPhase1Paths;
};

export const canLeaveCreatePollPage: CanDeactivateFn<
  CreatePollFormComponent
> = (component) => {
  if (!component.form.dirty) {
    return true;
  }

  if (component.isPollCreated()) {
    return window.confirm(
      "Do you really want to leave? You will lose your poll's data. Be sure you have already saved information about the created poll and you have already sent the desired invitations."
    );
  }
  return window.confirm(
    'Do you really want to leave? You will lose any entered data'
  );
};
