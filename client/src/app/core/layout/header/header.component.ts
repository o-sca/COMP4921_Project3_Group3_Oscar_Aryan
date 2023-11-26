import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  imports: [
    AsyncPipe,
    RouterLinkActive,
    RouterLink,
    NgIf,
    MatButtonModule,
    MatToolbarModule,
  ],
  standalone: true,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private _authSub: Subscription;
  public authenticated: boolean;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    this._authSub = {} as Subscription;
    this.authenticated = this.auth.authenticated;
  }

  ngOnInit(): void {
    this._authSub = this.auth.authChanged.subscribe(
      (status) => {
        this.authenticated = status;
      },
      (err) => console.error(err),
    );
  }

  ngOnDestroy(): void {
    this._authSub.unsubscribe();
  }

  signOut(): void {
    this.auth.signOut().subscribe((response) => {
      if (response.ok) {
        this.router.navigate([this.auth.redirectUrl]);
      }
    });
  }
}
