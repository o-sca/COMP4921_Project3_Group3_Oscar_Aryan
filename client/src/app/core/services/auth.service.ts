import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output, inject } from '@angular/core';
import { UtilityService } from './utility.service';
import { catchError, map, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

interface ProfileResponse {
  username: string;
  email: string;
  user_type: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authenticated: boolean;
  private _role: string;
  private _redirectUrl: string;
  private _baseUrl: string;
  private _cookie: CookieService;
  @Output() authChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() roleChanged: EventEmitter<string> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private utility: UtilityService,
  ) {
    this._cookie = inject(CookieService);
    this._baseUrl = this.utility.getApiUrl();
    this._redirectUrl = '';
    this._authenticated = this._cookie.get('authenticated') === 'true';
    this._role = this._cookie.get('role');
  }

  get authenticated() {
    return this._authenticated;
  }

  get role() {
    return this._role;
  }

  get redirectUrl() {
    return this._redirectUrl;
  }

  signIn(username: string, password: string) {
    return this.http
      .post(
        this._baseUrl + '/auth/login',
        {
          username: username,
          password: password,
        },
        { observe: 'response' },
      )
      .pipe(
        map((response) => {
          const body = response.body as { user: { user_type: string } };
          this._authenticated = true;
          this._redirectUrl = '/profile';
          this.setRoleChange(body.user.user_type);
          this.setAuthChange(true);
          this._cookie.set('role', body.user.user_type);
          this._cookie.set('authenticated', 'true');
          return response;
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }

  signUp(email: string, password: string, username: string) {
    return this.http
      .post(
        this._baseUrl + '/auth/signup',
        {
          email,
          password,
          username,
        },
        { observe: 'response' },
      )
      .pipe(
        map((response) => {
          const body = response.body as { user: { user_type: string } };

          this._authenticated = true;
          this._redirectUrl = '/';
          this.setRoleChange(body.user.user_type);
          this.setAuthChange(true);
          this._cookie.set('role', body.user.user_type);
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
      .get(this._baseUrl + '/auth/logout', { observe: 'response' })
      .pipe(
        map((response) => {
          this._cookie.deleteAll('/');
          this._authenticated = false;
          this._role = '';
          this._redirectUrl = '/';
          this.setRoleChange('');
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
      .get(this._baseUrl + '/auth/me', {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          const body = response.body as ProfileResponse;
          this.setAuthChange(true);
          this.setRoleChange(body.user_type);
          this._cookie.set('role', body.user_type);
          this._cookie.set('authenticated', 'true');
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

  private setRoleChange(role: string) {
    this.roleChanged.emit(role);
  }
}
