import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map, throwError } from 'rxjs';
import { ProfileResponse } from '../schemas/profile.schema';
import { JSON_HEADERS } from './http-header';
import { UtilityService } from './utility.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authenticated: boolean;
  private _redirectUrl: string;
  private _baseUrl: string;
  private _cookie: CookieService;
  @Output() authChanged: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private utility: UtilityService,
  ) {
    this._cookie = inject(CookieService);
    this._baseUrl = this.utility.getApiUrl();
    this._redirectUrl = '';
    this._authenticated = this._cookie.get('authenticated') === 'true';
  }

  get authenticated() {
    return this._authenticated;
  }

  get redirectUrl() {
    return this._redirectUrl;
  }

  signIn(email: string, password: string) {
    return this.http
      .post(
        this._baseUrl + '/auth/signin',
        {
          email,
          password,
        },
        {
          headers: JSON_HEADERS,
          observe: 'response',
        },
      )
      .pipe(
        map((response) => {
          this._authenticated = true;
          this._redirectUrl = '/profile';
          this.setAuthChange(true);
          this._cookie.set('authenticated', 'true');
          return response;
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }

  signUp({
    email,
    firstName,
    lastName,
    password,
    confirmPassword,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
  }) {
    return this.http
      .post(
        this._baseUrl + '/auth/signup',
        {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        },
        {
          headers: JSON_HEADERS,
          observe: 'response',
        },
      )
      .pipe(
        map((response) => {
          this._authenticated = true;
          this._redirectUrl = '/';
          this.setAuthChange(true);
          this._cookie.set('authenticated', 'true');
          return response;
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }

  signOut() {
    return this.http
      .get(this._baseUrl + '/auth/signout', {
        headers: JSON_HEADERS,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          this._cookie.deleteAll('/');
          this._authenticated = false;
          this._redirectUrl = '/';
          this.setAuthChange(false);
          return response;
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }

  checkMe() {
    return this.http
      .get(this._baseUrl + '/auth/profile', {
        headers: JSON_HEADERS,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          const body = response.body as ProfileResponse;
          if (body) {
            this.setAuthChange(true);
            this._cookie.set('authenticated', 'true');
            return body;
          }
          return body;
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }

  checkAuthenticated() {
    return this.http
      .get(this._baseUrl + '/auth/session', {
        headers: JSON_HEADERS,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          const body = response.body as { authenticated: boolean };
          this.setAuthChange(body.authenticated);
          this._cookie.set('authenticated', body.authenticated.toString());
          return body;
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }

  private setAuthChange(status: boolean) {
    this.authChanged.emit(status);
  }
}
