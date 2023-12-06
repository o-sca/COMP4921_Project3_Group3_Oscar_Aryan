import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { MatSelectModule } from '@angular/material/select';
import { CalendarApi, DateSelectArg } from '@fullcalendar/core';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { FriendProfile } from '../../../../schemas/friends.schema';
import { EventService } from '../../../../services/event.service';
import { FriendService } from '../../../../services/friend.service';
import { SpinnerService } from '../../../../services/spinner.service';

@Component({
  templateUrl: './create-event-dialog.component.html',
  styleUrl: './create-event-dialog.component.css',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCheckboxModule,
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
    NgxMatTimepickerModule,
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
  startTime: FormControl<string>;
  endDate: FormControl<Date>;
  endTime: FormControl<string>;
  selectedColor: FormControl<string>;

  searchFriendInput: FormControl<string>;
  friends: FriendProfile[];
  friendsSelected: FriendProfile[];
  selectedFriends: Set<FriendProfile>;

  allDay: boolean;
  repeatOptions: { value: number[]; viewValue: string }[];
  repeatOption: FormControl<string>;

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
    this.startTime = new FormControl<string>('00:00', { nonNullable: true });
    this.endDate = new FormControl<Date>(data.dateSelectInfo.end, {
      nonNullable: true,
    });
    this.endTime = new FormControl<string>('00:00', { nonNullable: true });

    this.searchFriendInput = new FormControl<string>('', { nonNullable: true });

    this.friends = [];
    this.friendsSelected = [];
    this.selectedFriends = new Set<FriendProfile>();

    this.allDay = false;
    this.repeatOptions = [
      { viewValue: 'Does not repeat', value: [] },
      { viewValue: 'Daily', value: [0, 1, 2, 3, 4, 5, 6] },
      { viewValue: 'Weekly', value: [data.dateSelectInfo.start.getUTCDay()] },
    ];
    this.repeatOption = new FormControl<string>(
      this.repeatOptions[0].viewValue,
      {
        nonNullable: true,
      },
    );
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

    const startDate = this.mergeDateAndTime(this.startDate, this.startTime);
    const endDate = this.mergeDateAndTime(this.endDate, this.endTime);

    this.event
      .create({
        eventTitle: this.eventTitle.value,
        color: this.selectedColor.value,
        startDate: startDate,
        endDate: endDate,
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
            allDay: this.allDay,
            daysOfWeek: this.repeatOption.value,
            start: startDate,
            end: endDate,
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

  private mergeDateAndTime(date: FormControl<Date>, time: FormControl<string>) {
    const dateSliced = date.value.toISOString().slice(0, 11);
    const newDateTime = new Date(dateSliced + time.value);
    return newDateTime;
  }
}
