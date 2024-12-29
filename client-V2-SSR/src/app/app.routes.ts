import { Routes } from '@angular/router';
import { CardContainerComponent } from './landing/card-container/card-container.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { CreatePollFormComponent } from './create-poll-form/create-poll-form.component';
import { MakeSuggestionsFormComponent } from './make-suggestions-form/make-suggestions-form.component';
import {
  canLeaveCreatePollPage,
  canMatchAuthenticatedPaths,
  canMatchPhaseSpecificPaths,
  canMatchRoleSpecificPaths,
  canVoteForSpecificRank,
} from './route-guards';
import { LoadingPageComponent } from './shared/loading-page/loading-page.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { VoteFormComponent } from './vote-form/vote-form.component';
import { VotesOverviewComponent } from './votes-overview/votes-overview.component';
import { ResultsComponent } from './shared/results/results.component';
import { AboutPageComponent } from './shared/about-page/about-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    component: CardContainerComponent,
  },
  {
    path: 'participant',
    children: [
      {
        path: 'login',
        component: LoginFormComponent,
      },
      {
        path: 'suggest/:password',
        canMatch: [
          canMatchRoleSpecificPaths('participant'),
          canMatchPhaseSpecificPaths(1),
        ],
        component: MakeSuggestionsFormComponent,
      },
      {
        path: 'vote/:password',
        canMatch: [
          canMatchRoleSpecificPaths('participant'),
          canMatchPhaseSpecificPaths(2),
          canVoteForSpecificRank,
        ],
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: 'overview',
            component: VotesOverviewComponent,
            data: {
              updateAble: true,
            },
          },
          {
            path: ':rank',
            component: VoteFormComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        component: LoginFormComponent,
      },
      {
        path: 'check/:password',
        component: AdminDashboardComponent,
        canMatch: [canMatchRoleSpecificPaths('admin')],
      },
    ],
  },
  {
    path: 'common',
    children: [
      {
        path: 'results/:password',
        component: ResultsComponent,
        canMatch: [canMatchPhaseSpecificPaths(3), canMatchAuthenticatedPaths],
      },
    ],
  },
  {
    path: 'create',
    component: CreatePollFormComponent,
    canDeactivate: [canLeaveCreatePollPage],
  },
  {
    path: 'loading',
    component: LoadingPageComponent,
  },
  {
    path: 'main/about',
    component: AboutPageComponent,
  },
];
