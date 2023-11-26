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
import { MatIconModule } from '@angular/material/icon';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Friend } from '../core/schemas/friends.schema';
import { AuthService } from '../core/services/auth.service';
import { FriendService } from '../core/services/friend.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileEditDialogComponent } from './profile-edit-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
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

  constructor(
    private auth: AuthService,
    private friend: FriendService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    public dialog: MatDialog,
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
    this.requestPaginator = new MatPaginator(
      new MatPaginatorIntl(),
      this.changeDetector,
    );

    this.friendsDataSource = new MatTableDataSource<Friend>([]);
    this.friendsDisplayColumns = [
      'profile_pic',
      'first_name',
      'last_name',
      'status',
    ];
    this.friendsPaginator = new MatPaginator(
      new MatPaginatorIntl(),
      this.changeDetector,
    );
  }

  ngAfterViewInit(): void {
    this.requestDataSource.paginator = this.requestPaginator;
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
      error(err) {
        console.error(err);
      },
    });

    this.friend.getFriends().subscribe({
      next: (response) => {
        this.requestDataSource.data = response.requests;
        this.friendsDataSource.data = response.friends;
      },
      error: (err) => {
        console.error(err);
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
      next: () => {
        this.requestDataSource.data = this.requestDataSource.data.filter(
          (f) => f.id !== friend.id,
        );
        this.friendsDataSource.data.push(friend);
      },
    });
  }

  declineFriend(friend: Friend) {
    this.friend.rejectFriend(friend).subscribe();
  }
}
