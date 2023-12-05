import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthedGuard } from './core/guards/authed.guard';
import { EventsComponent } from './events/events.component';
import { LandingComponent } from './landing/landing.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/:id',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'events',
    component: EventsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'signin',
    component: SignInComponent,
    canActivate: [AuthedGuard],
    data: { customRedirect: '/' },
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [AuthedGuard],
    data: { customRedirect: '/' },
  },
  { path: '**', component: PageNotFoundComponent },
];
