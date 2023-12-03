import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { FriendProfile } from '../schemas/friends.schema';
import { JSON_HEADERS } from './http-header';
import { UtilityService } from './utility.service';
import { Event } from '../schemas/events.schema';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly _baseUrl: string;

  constructor(
    private http: HttpClient,
    private utility: UtilityService,
  ) {
    this._baseUrl = this.utility.getApiUrl();
  }

  getEvent(eventId: number) {
    return this.http
      .get(this._baseUrl + '/event/' + eventId, { observe: 'response' })
      .pipe(
        map((response) => {
          return response.body as Event;
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }

  getEvents() {
    return this.http
      .get(this._baseUrl + '/event', { observe: 'response' })
      .pipe(
        map((response) => {
          return response.body as Event[];
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }

  create({
    eventTitle,
    color,
    startDate,
    endDate,
    friendsSelected,
  }: {
    eventTitle: string;
    color: string;
    startDate: Date;
    endDate: Date;
    friendsSelected: Set<FriendProfile>;
  }) {
    return this.http
      .post(
        this._baseUrl + '/event/create',
        {
          eventTitle: eventTitle,
          color: color,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          friends: Array.from(friendsSelected),
        },
        { observe: 'response', headers: JSON_HEADERS },
      )
      .pipe(
        map((response) => {
          return response.body as { id: number };
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }
}
