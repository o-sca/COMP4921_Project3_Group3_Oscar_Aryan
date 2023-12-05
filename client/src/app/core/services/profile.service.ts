import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { UtilityService } from './utility.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly _baseUrl: string;

  constructor(
    private http: HttpClient,
    private utility: UtilityService,
    private router: Router,
  ) {
    this._baseUrl = this.utility.getApiUrl();
  }

  uploadProfilePic(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post(this._baseUrl + '/storage/avatars/upload', formData, {
        reportProgress: true,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.ok) {
            return true;
          }
          return false;
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }

  goToProfile(profileId: number) {
    return this.router.navigate(['profile', profileId]);
  }
}
