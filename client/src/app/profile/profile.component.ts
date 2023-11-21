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
  username: string;
  email: string;
  userType: string;

  constructor(private auth: AuthService) {
    this.username = '';
    this.email = '';
    this.userType = '';
  }

  ngOnInit(): void {
    this.auth.checkMe().subscribe({
      next: (response) => {
        this.username = response['username'];
        this.email = response['email'];
        this.userType = response['user_type'];
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
