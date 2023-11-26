import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from './utility.service';
import { catchError, map, throwError } from 'rxjs';
import { Friend } from '../schemas/friends.schema';
import { JSON_HEADERS } from './http-header';

@Injectable({ providedIn: 'root' })
export class FriendService {
  private readonly _baseUrl: string;

  constructor(
    private http: HttpClient,
    private utility: UtilityService,
  ) {
    this._baseUrl = this.utility.getApiUrl();
  }

  getFriends() {
    return this.http
      .get(this._baseUrl + '/friends', {
        headers: JSON_HEADERS,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          const body = response.body as Friend[];

          const requests = body.filter((friend) => {
            return friend.invitation_status === 'PENDING';
          });

          const friends = body.filter((friend) => {
            return friend.invitation_status === 'ACCEPTED';
          });

          return {
            requests,
            friends,
          };
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }

  getFriend(id: number) {
    return this.http
      .get(this._baseUrl + `/friends/${id}`, {
        headers: JSON_HEADERS,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }

  acceptFriend(friend: Friend) {
    return this.http
      .put(this._baseUrl + `/friends/accept?id=${friend.id}`, null, {
        headers: JSON_HEADERS,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }

  rejectFriend(friend: Friend) {
    return this.http
      .put(this._baseUrl + `/friends/reject?id=${friend.id}`, null, {
        headers: JSON_HEADERS,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }
}
