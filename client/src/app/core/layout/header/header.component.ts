import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

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
  private _roleSub: Subscription;
  public authenticated: boolean;
  public role: string;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    this._authSub = {} as Subscription;
    this._roleSub = {} as Subscription;
    this.authenticated = this.auth.authenticated;
    this.role = this.auth.role;
  }

  ngOnInit(): void {
    this.auth.checkMe().subscribe();
    this._authSub = this.auth.authChanged.subscribe(
      (status) => {
        this.authenticated = status;
      },
      (err) => console.error(err),
    );

    this._roleSub = this.auth.roleChanged.subscribe(
      (role) => {
        this.role = role;
      },
      (err) => console.error(err),
    );
  }

  ngOnDestroy(): void {
    this._authSub.unsubscribe();
    this._roleSub.unsubscribe();
  }

  signOut(): void {
    this.auth.signOut().subscribe((response) => {
      if (response.ok) {
        this.router.navigate([this.auth.redirectUrl]);
      }
    });
  }
}
