import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FriendService } from '../core/services/friend.service';
import { FriendProfile } from '../core/schemas/friends.schema';
import { MatListModule } from '@angular/material/list';

@Component({
  templateUrl: './friend-search-dialog.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatDialogTitle,
    MatFormFieldModule,
    MatListModule,
  ],
})
export class FriendSearchDialogComponent {
  users: FriendProfile[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FriendProfile[],
    private friend: FriendService,
  ) {
    this.users = data;
  }

  sendFriendRequest(user: FriendProfile) {
    this.friend.sendFriendRequest(user.id).subscribe();
  }
}
