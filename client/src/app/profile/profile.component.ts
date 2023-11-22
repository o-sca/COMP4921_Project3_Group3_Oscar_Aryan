import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  firstName: string;
  email: string;
  profilePicUrl: string;

  constructor(private auth: AuthService) {
    this.firstName = '';
    this.email = '';
    this.profilePicUrl = '';
  }

  ngOnInit(): void {
    this.auth.checkMe().subscribe({
      next: (response) => {
        this.firstName = response.user.first_name;
        this.email = response.user.email;
        this.profilePicUrl = response.user.profile_pic_url;
      },
      error(err) {
        console.error(err);
      },
    });
  }

  ngOnDestroy(): void {
    return;
  }
}
