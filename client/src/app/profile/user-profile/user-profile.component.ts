import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { UserProfileFriend } from '../../core/schemas/friends.schema';
import { FriendService } from '../../core/services/friend.service';
import { MatListModule } from '@angular/material/list';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  id: string;
  friends: UserProfileFriend[];
  profile: UserProfileFriend;
  clientId: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private friend: FriendService,
    public profileService: ProfileService,
  ) {
    this.id = '';
    this.clientId = 0;
    this.friends = [];
    this.profile = {} as UserProfileFriend;
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id') as string;

      this.friend.getUserFriends(parseInt(this.id, 10)).subscribe({
        next: (body) => {
          if (body.length < 1) {
            return this.router.navigate(['/profile']);
          }

          this.profile = body[0];

          this.friends = body.slice(1);

          return;
        },
      });
    });
  }
}
