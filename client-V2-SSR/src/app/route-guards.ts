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
import { DecideNavigationService } from './shared/decide-navigation.service';

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

export const canVoteForSpecificRank: CanMatchFn = (route, segments) => {
  let sharedService = inject(SharedService);
  let navService = inject(DecideNavigationService);
  let router = inject(Router);
  let currentRank = +segments[2].path;
  return navService
    .getNumberOfUserVotes(segments[1].path, +sharedService.public_user_id())
    .pipe(
      take(1),
      map((numberOfVotes) => {
        if (segments[2].path === 'overview')
          return numberOfVotes === 3
            ? true
            : new RedirectCommand(router.parseUrl('?phaseInvalid=true'));
        if (numberOfVotes === currentRank - 1) return true;
        return new RedirectCommand(router.parseUrl('?phaseInvalid=true'));
      })
    );
};

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

export const canMatchAuthenticatedPaths: CanMatchFn = (route, segments) => {
  const router = inject(Router);
  const sharedService = inject(SharedService);
  console.log(segments);
  return sharedService.checkAndInitializeUser().pipe(
    take(1),
    map((result) => {
      if (result === 'participant' || result === 'admin') return true;
      if (result === 'loading')
        return new RedirectCommand(router.parseUrl('/loading'));
      return new RedirectCommand(router.parseUrl('?auth=true'));
    })
  );
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
