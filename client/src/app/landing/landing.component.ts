import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SpinnerService } from '../core/services/spinner.service';
import { IgxCalendarComponent } from 'igniteui-angular';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    IgxCalendarComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  constructor(public spinner: SpinnerService) {}
}
