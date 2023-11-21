import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { SpinnerService } from '../core/services/spinner.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  registrationError: boolean;
  errorMessage: string;

  username: FormControl;
  email: FormControl;
  password: FormControl;

  constructor(
    private auth: AuthService,
    private router: Router,
    public spinner: SpinnerService,
  ) {
    this.registrationError = false;
    this.errorMessage = '';

    this.username = new FormControl(null, [Validators.required]);
    this.email = new FormControl(null, [Validators.required, Validators.email]);
    this.password = new FormControl(null, [Validators.required]);
  }

  signUp() {
    this.auth
      .signUp(this.email.value!, this.password.value!, this.username.value!)
      .subscribe({
        next: () => {
          this.router.navigate([this.auth.redirectUrl]);
        },
        error: (err) => {
          this.registrationError = true;
          this.errorMessage = err.error.message;
        },
      });
  }

  getErrorMessage(control: FormControl) {
    if (control.getError('required')) {
      return 'You must enter a value';
    }
    if (control.getError('email')) {
      return 'You must enter a valid email';
    }
    return 'Invalid value';
  }
}
