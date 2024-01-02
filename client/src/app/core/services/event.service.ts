import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { Friend } from '../schemas/friends.schema';
import { JSON_HEADERS } from './http-header';
import { UtilityService } from './utility.service';
import { Event } from '../schemas/events.schema';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly _baseUrl: string;

  constructor(private http: HttpClient, private utility: UtilityService) {
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

  getDeletedEvents() {
    return this.http
      .get(this._baseUrl + '/event/deleted', { observe: 'response' })
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
    allDay,
    color,
    daysOfWeek,
    startDate,
    endDate,
    friendsSelected,
  }: {
    eventTitle: string;
    allDay: boolean;
    color: string;
    daysOfWeek: number[];
    startDate: Date;
    endDate: Date;
    friendsSelected: Friend[];
  }) {
    return this.http
      .post(
        this._baseUrl + '/event/create',
        {
          eventTitle: eventTitle,
          allDay: allDay,
          color: color,
          daysOfWeek: daysOfWeek,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          friends: Array.from(friendsSelected.values()),
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

  delete(eventId: number) {
    return this.http
      .delete(this._baseUrl + '/event?id=' + eventId, { observe: 'response' })
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

  accept(eventId: number) {
    return this.http
      .patch(
        this._baseUrl + '/event/' + eventId,
        { invitationStatus: 'ACCEPTED' },
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

  decline(eventId: number) {
    return this.http
      .patch(
        this._baseUrl + '/event/' + eventId,
        { invitationStatus: 'DECLINED' },
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

  restore(eventId: number) {
    return this.http
      .patch(
        this._baseUrl + '/event?id=' + eventId,
        { deleted: false },
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
}
