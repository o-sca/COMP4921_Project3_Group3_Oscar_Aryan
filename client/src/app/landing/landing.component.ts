import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SpinnerService } from '../core/services/spinner.service';
import { CreateEventDialogComponent } from '../core/layout/dialogs/calendar/create-event/create-event-dialog.component';
import { EventService } from '../core/services/event.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FullCalendarModule,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  calendarOptions: CalendarOptions;

  constructor(
    public spinner: SpinnerService,
    public dialog: MatDialog,
    private event: EventService,
  ) {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: true,
      editable: true,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      },
      select: this.handleDateSelect.bind(this),
    };
  }

  ngOnInit(): void {
    const eventsToAdd: EventInput[] = [];
    this.event.getEvents().subscribe({
      next: (events) => {
        events.forEach((event) => {
          eventsToAdd.push({
            title: event.title,
            start: event.start_date_time,
            end: event.end_date_time,
          });
        });
        this.calendarOptions.events = eventsToAdd;
      },
    });
  }

  private handleDateSelect(selectInfo: DateSelectArg) {
    this.dialog.open(CreateEventDialogComponent, {
      data: {
        dateSelectInfo: selectInfo,
        calendarApi: selectInfo.view.calendar,
      },
    });
  }
}
