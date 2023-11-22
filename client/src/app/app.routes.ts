import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LandingComponent } from './landing/landing.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthedGuard } from './core/guards/authed.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
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
