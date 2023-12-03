import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { EventService } from '../../../../services/event.service';
import { Event } from '../../../../schemas/events.schema';

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
  ],
})
export class ShowEventDialogComponent {
  eventInfo: Event;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private event: EventService,
  ) {
    this.eventInfo = {} as Event;
    this.event.getEvent(parseInt(data.id)).subscribe({
      next: (event) => {
        this.eventInfo = event;
      },
    });
  }
}
