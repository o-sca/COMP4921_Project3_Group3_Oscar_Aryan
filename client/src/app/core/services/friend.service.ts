import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from './utility.service';
import { catchError, map, throwError } from 'rxjs';
import { Friend, FriendSuggestion } from '../schemas/friends.schema';
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
            return (
              friend.invitation_status === 'PENDING' &&
              friend.friend_id !== friend.receiver_id
            );
          });

          const friends = body.filter((friend) => {
            return (
              friend.invitation_status === 'ACCEPTED' ||
              friend.friend_id === friend.receiver_id
            );
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

  acceptFriend(friend: Friend) {
    return this.http
      .patch(
        this._baseUrl + `/friends/accept?id=${friend.friend_request_id}`,
        null,
        {
          headers: JSON_HEADERS,
          observe: 'response',
        },
      )
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

  rejectFriend(friend: Friend) {
    return this.http
      .patch(
        this._baseUrl + `/friends/reject?id=${friend.friend_request_id}`,
        null,
        {
          headers: JSON_HEADERS,
          observe: 'response',
        },
      )
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

  removeFriend(friend: Friend) {
    return this.http
      .delete(this._baseUrl + `/friends/remove?id=${friend.friend_id}`, {
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

  removeRequest(friend: Friend) {
    return this.http
      .delete(
        this._baseUrl + `/friends/cancel?id=${friend.friend_request_id}`,
        {
          observe: 'response',
        },
      )
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

  suggestFriends() {
    return this.http
      .get(this._baseUrl + '/friends/suggest', {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return response.body as FriendSuggestion[];
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }

  sendFriendRequest(friendId: number) {
    return this.http
      .post(this._baseUrl + `/friends/add?id=${friendId}`, null, {
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

  searchFriend(name: string) {
    return this.http
      .get(this._baseUrl + `/friends/search?name=${name}`, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return response.body;
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }
}
