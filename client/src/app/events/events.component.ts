import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EventService } from '../core/services/event.service';
import { Event } from '../core/schemas/events.schema';
import { UtilityService } from '../core/services/utility.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  eventsSource: MatTableDataSource<Event>;
  eventsDisplayColumns: string[];

  deletedSource: MatTableDataSource<Event>;

  constructor(
    private event: EventService,
    private utility: UtilityService,
  ) {
    this.eventsSource = new MatTableDataSource<Event>();
    this.eventsDisplayColumns = ['title', 'start_date_time', 'end_date_time'];

    this.deletedSource = new MatTableDataSource<Event>();
  }

  ngOnInit() {
    this.event.getEvents().subscribe({
      next: (events) => {
        events.forEach((event) => {
          event.start_date_time = this.utility.convertDate(
            event.start_date_time,
          );
          event.end_date_time = this.utility.convertDate(event.end_date_time);
        });
        this.eventsSource.data = events;
      },
    });

    this.event.getDeletedEvents().subscribe({
      next: (events) => {
        events.forEach((event) => {
          event.start_date_time = this.utility.convertDate(
            event.start_date_time,
          );
          event.end_date_time = this.utility.convertDate(event.end_date_time);
        });
        this.deletedSource.data = events;
      },
    });
  }

  restoreEvent(eventToRestore: Event) {
    this.event.restore(eventToRestore.id).subscribe({
      next: (success) => {
        if (success) {
          this.eventsSource.data.push(eventToRestore);
          this.eventsSource._updateChangeSubscription();
          this.deletedSource.data = this.deletedSource.data.filter(
            (event) => event.id !== eventToRestore.id,
          );
        }
      },
    });
  }
}
