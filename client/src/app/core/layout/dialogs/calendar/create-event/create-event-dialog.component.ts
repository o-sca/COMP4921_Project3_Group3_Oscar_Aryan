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
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CalendarApi, DateSelectArg } from '@fullcalendar/core';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { Friend } from '../../../../schemas/friends.schema';
import { EventService } from '../../../../services/event.service';
import { FriendService } from '../../../../services/friend.service';
import { SpinnerService } from '../../../../services/spinner.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

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
    MatTableModule,
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

  friendsSource = new MatTableDataSource<Friend>();
  friendsColumns: string[] = ['first_name', 'last_name', 'select'];

  selection = new SelectionModel<Friend>(true, []);

  allDay: boolean;
  repeatOptions: { index: number; value: number[]; viewValue: string }[];
  repeatOption: FormControl<number[]>;

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

    this.allDay = false;
    this.repeatOptions = [
      { index: 0, viewValue: 'Does not repeat', value: [] },
      { index: 1, viewValue: 'Daily', value: [0, 1, 2, 3, 4, 5, 6] },
      {
        index: 2,
        viewValue: 'Weekly',
        value: [data.dateSelectInfo.start.getUTCDay()],
      },
    ];
    this.repeatOption = new FormControl<number[]>(this.repeatOptions[0].value, {
      nonNullable: true,
    });

    this.friend.getFriends().subscribe({
      next: (body) => {
        this.friendsSource.data = body.friends;
      },
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.friendsSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
  }

  checkboxLabel(row?: Friend): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.first_name + 1
    }`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.friendsSource.filter = filterValue.trim().toLowerCase();
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
        daysOfWeek: this.repeatOption.value,
        allDay: this.allDay,
        startDate: startDate,
        endDate: endDate,
        friendsSelected: this.selection.selected,
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
            daysOfWeek: this.repeatOption.value.toString(),
            start: startDate,
            end: endDate,
            color: this.selectedColor.value,
          });
          this.calendarApi.unselect();
        },
      });
  }

  private mergeDateAndTime(date: FormControl<Date>, time: FormControl<string>) {
    const dateSliced = date.value.toISOString().slice(0, 11);
    const newDateTime = new Date(dateSliced + time.value);
    return newDateTime;
  }
}
