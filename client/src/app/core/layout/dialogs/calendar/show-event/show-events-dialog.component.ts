import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CalendarApi } from '@fullcalendar/core';
import { Event } from '../../../../schemas/events.schema';
import { EventService } from '../../../../services/event.service';
import { SpinnerService } from '../../../../services/spinner.service';

@Component({
  templateUrl: './show-events-dialog.component.html',
  styleUrl: './show-events-dialog.component.css',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatDialogTitle,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class ShowEventDialogComponent implements OnInit {
  id: number;
  calendar: CalendarApi;
  eventOwner: boolean;
  eventInfo?: Event;
  pendingInvitation: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { id: string; calendarApi: CalendarApi },
    public spinner: SpinnerService,
    private event: EventService,
  ) {
    this.id = parseInt(data.id, 10);
    this.calendar = data.calendarApi;
    this.pendingInvitation = true;
    this.eventOwner = false;
  }

  ngOnInit(): void {
    this.event.getEvent(this.id).subscribe({
      next: (event) => {
        if (event.userId === event.event_owner_id) this.eventOwner = true;
        event.start_date_time = this.convertDate(event.start_date_time);
        event.end_date_time = this.convertDate(event.end_date_time);
        event.Event_Attendance.forEach((attendee) => {
          if (
            attendee.user_attende_id === event.userId &&
            attendee.response_type !== 'PENDING'
          ) {
            this.pendingInvitation = false;
          }
        });
        this.eventInfo = event;
      },
    });
  }

  deleteEvent() {
    if (!this.eventInfo) return;
    this.event.delete(this.eventInfo.id).subscribe({
      next: (success) => {
        if (success) {
          this.calendar.getEventById(this.id.toString())?.remove();
        }
      },
    });
  }

  acceptEvent() {
    if (!this.eventInfo) return;
    this.event.accept(this.eventInfo.id).subscribe();
  }

  declineEvent() {
    if (!this.eventInfo) return;
    this.event.decline(this.eventInfo.id).subscribe({
      next: (success) => {
        if (success) {
          this.calendar.getEventById(this.id.toString())?.remove();
        }
      },
    });
  }

  private convertDate(date: string) {
    const dateString = new Date(date).toDateString();
    const timeString = new Date(date).toLocaleTimeString();
    return dateString + ' ' + timeString;
  }
}
