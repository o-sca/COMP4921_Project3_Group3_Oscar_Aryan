import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
  MatNativeDateModule,
  NativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CalendarApi, DateSelectArg } from '@fullcalendar/core';
import { SpinnerService } from '../../../../services/spinner.service';
import { FriendService } from '../../../../services/friend.service';
import { FriendProfile } from '../../../../schemas/friends.schema';
import { EventService } from '../../../../services/event.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  templateUrl: './create-event-dialog.component.html',
  styleUrl: './create-event-dialog.component.css',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDialogTitle,
    MatFormFieldModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: NativeDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
})
export class CreateEventDialogComponent {
  calendarApi: CalendarApi;
  eventColors: { value: string; viewValue: string }[];
  eventTitle: FormControl<string>;
  startDate: FormControl<Date>;
  endDate: FormControl<Date>;
  selectedColor: FormControl<string>;

  searchFriendInput: FormControl<string>;
  friends: FriendProfile[];
  friendsSelected: FriendProfile[];
  selectedFriends: Set<FriendProfile>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      dateSelectInfo: DateSelectArg;
      calendarApi: CalendarApi;
    },
    public spinner: SpinnerService,
    private friend: FriendService,
    private event: EventService,
  ) {
    this.calendarApi = data.calendarApi;
    this.eventTitle = new FormControl<string>('', { nonNullable: true });
    this.eventColors = [
      { value: '#3788d8', viewValue: 'Blue' },
      { value: '#ff0000', viewValue: 'Red' },
      { value: '#228B22', viewValue: 'Green' },
      { value: '#4B0082', viewValue: 'Purple' },
    ];
    this.selectedColor = new FormControl<string>('#3788d8', {
      nonNullable: true,
    });
    this.startDate = new FormControl<Date>(data.dateSelectInfo.start, {
      nonNullable: true,
    });
    this.endDate = new FormControl<Date>(data.dateSelectInfo.end, {
      nonNullable: true,
    });

    this.searchFriendInput = new FormControl<string>('', { nonNullable: true });

    this.friends = [];
    this.friendsSelected = [];
    this.selectedFriends = new Set<FriendProfile>();
  }

  searchFriend() {
    if (!this.searchFriendInput.value) {
      return;
    }
    this.friend.searchFriend(this.searchFriendInput.value).subscribe({
      next: (results) => {
        this.friends = results;
      },
    });
  }

  createEvent() {
    if (!this.eventTitle.value) {
      return;
    }

    this.event
      .create({
        eventTitle: this.eventTitle.value,
        color: this.selectedColor.value,
        startDate: new Date(this.startDate.value),
        endDate: new Date(this.endDate.value),
        friendsSelected: this.selectedFriends,
      })
      .subscribe({
        next: (body) => {
          if (!body) {
            return;
          }
          this.calendarApi.addEvent({
            id: body.id.toString(),
            title: this.eventTitle.value,
            start: this.startDate.value,
            end: this.endDate.value,
            color: this.selectedColor.value,
          });
          this.calendarApi.unselect();
        },
      });
  }

  selected(event: MatSelectionListChange) {
    event.source.selectedOptions.selected.map((option) => {
      if (option.selected) {
        this.selectedFriends.add(option.value);
      }
    });
  }
}
