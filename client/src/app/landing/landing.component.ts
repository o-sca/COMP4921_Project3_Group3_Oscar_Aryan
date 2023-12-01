import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SpinnerService } from '../core/services/spinner.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

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
export class LandingComponent {
  calendarOptions: CalendarOptions;

  constructor(public spinner: SpinnerService) {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],
    };
  }
}
