import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Friend, FriendSuggestion } from '../core/schemas/friends.schema';
import { InvitationStatus } from '../core/schemas/invitation-status';
import { AuthService } from '../core/services/auth.service';
import { FriendService } from '../core/services/friend.service';
import { ProfileEditDialogComponent } from './dialogs/profile-edit-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FriendSearchDialogComponent } from './dialogs/friend-search-dialog.component';
import { ProfileService } from '../core/services/profile.service';

@Component({
  selector: 'app-profile',
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
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  firstName: string;
  email: string;
  profilePicUrl: string;

  @ViewChild(MatPaginator) requestPaginator: MatPaginator;
  requestDataSource: MatTableDataSource<Friend>;
  requestDisplayColumns: string[];

  @ViewChild(MatPaginator) friendsPaginator: MatPaginator;
  friendsDataSource: MatTableDataSource<Friend>;
  friendsDisplayColumns: string[];

  suggestions: FriendSuggestion[];

  isSearchInputVisible: boolean;
  searchInput: FormControl<string>;

  constructor(
    private auth: AuthService,
    private friend: FriendService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    public dialog: MatDialog,
    public profile: ProfileService,
    private snackBar: MatSnackBar,
  ) {
    this.firstName = '';
    this.email = '';
    this.profilePicUrl = '';

    this.requestDataSource = new MatTableDataSource<Friend>([]);
    this.requestDisplayColumns = [
      'profile_pic',
      'first_name',
      'last_name',
      'action',
    ];
    this.friendsDataSource = new MatTableDataSource<Friend>([]);
    this.friendsDisplayColumns = [
      'profile_pic',
      'first_name',
      'last_name',
      'status',
    ];

    this.suggestions = [];
    this.isSearchInputVisible = false;
    this.searchInput = new FormControl<string>('', {
      nonNullable: true,
    });

    this.requestPaginator = new MatPaginator(
      new MatPaginatorIntl(),
      this.changeDetector,
    );

    this.friendsPaginator = new MatPaginator(
      new MatPaginatorIntl(),
      this.changeDetector,
    );
  }

  ngAfterViewInit(): void {
    this.requestDataSource.paginator = this.requestPaginator;
    this.friendsDataSource.paginator = this.friendsPaginator;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        return this.friend.getFriend(id);
      }),
    );

    this.auth.checkMe().subscribe({
      next: (response) => {
        this.firstName = response.first_name;
        this.email = response.email;
        this.profilePicUrl = response.profile_pic_url;
      },
    });

    this.friend.getFriends().subscribe({
      next: (response) => {
        this.requestDataSource.data = response.requests;
        this.friendsDataSource.data = response.friends;
      },
    });

    this.friend.suggestFriends().subscribe({
      next: (suggestions) => {
        this.suggestions = suggestions;
      },
    });
  }

  ngOnDestroy(): void {
    return;
  }

  openDialog() {
    this.dialog.open(ProfileEditDialogComponent, {
      data: {
        profilePicUrl: this.profilePicUrl,
      },
    });
  }

  acceptFriend(friend: Friend) {
    this.friend.acceptFriend(friend).subscribe({
      next: (success) => {
        if (success) {
          const removeIndex = this.requestDataSource.data.indexOf(friend);
          this.requestDataSource.data.splice(removeIndex, 1);
          this.requestDataSource.data = [...this.requestDataSource.data];

          friend.invitation_status = InvitationStatus.ACCEPTED;

          this.friendsDataSource.data.push(friend);
          this.friendsDataSource.data = [...this.friendsDataSource.data];
          return;
        }
        return this.openSnackBar();
      },
    });
  }

  declineFriend(friend: Friend) {
    this.friend.rejectFriend(friend).subscribe({
      next: (success) => {
        if (success) {
          const removeIndex = this.requestDataSource.data.indexOf(friend);
          this.requestDataSource.data.splice(removeIndex, 1);
          this.requestDataSource.data = [...this.requestDataSource.data];
          return;
        }
        return this.openSnackBar();
      },
    });
  }

  removeFriend(friend: Friend) {
    this.friend.removeFriend(friend).subscribe({
      next: (success) => {
        if (success) {
          const removeIndex = this.friendsDataSource.data.indexOf(friend);
          this.friendsDataSource.data.splice(removeIndex, 1);
          this.friendsDataSource.data = [...this.friendsDataSource.data];
          return;
        }
        return this.openSnackBar();
      },
    });
  }

  removeRequest(friend: Friend) {
    this.friend.removeRequest(friend).subscribe({
      next: (success) => {
        if (success) {
          const removeIndex = this.friendsDataSource.data.indexOf(friend);
          this.friendsDataSource.data.splice(removeIndex, 1);
          this.friendsDataSource.data = [...this.friendsDataSource.data];
          return;
        }
        return this.openSnackBar();
      },
    });
  }

  sendFriendRequest(suggestion: FriendSuggestion) {
    this.friend.sendFriendRequest(suggestion.id).subscribe({
      next: (success) => {
        if (success) {
          const removeIndex = this.suggestions.indexOf(suggestion);
          this.suggestions.splice(removeIndex, 1);
          this.suggestions = [...this.suggestions];
          return;
        }
        return this.openSnackBar();
      },
    });
  }

  findFriend() {
    if (!this.searchInput.value) {
      return this.openSnackBar('You forgot to enter a search term, silly');
    }
    this.friend.findFriend(this.searchInput.value).subscribe({
      next: (results) => {
        this.dialog.open(FriendSearchDialogComponent, {
          data: results,
        });
      },
      error: (err) => {
        return this.openSnackBar(err.error.message);
      },
    });
  }

  toggleSearchInput() {
    this.isSearchInputVisible = !this.isSearchInputVisible;
  }

  private openSnackBar(message?: string) {
    this.snackBar.open(message || 'Something went wrong', 'OK');
  }
}
