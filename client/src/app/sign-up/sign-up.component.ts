import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
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

interface SignUpForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

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
  signUpForm: FormGroup<SignUpForm>;

  constructor(
    private auth: AuthService,
    private router: Router,
    public spinner: SpinnerService,
  ) {
    this.registrationError = false;
    this.errorMessage = '';

    this.signUpForm = new FormGroup<SignUpForm>({
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  signUp() {
    this.auth
      .signUp({
        email: this.signUpForm.value.email!,
        firstName: this.signUpForm.value.firstName!,
        lastName: this.signUpForm.value.lastName!,
        password: this.signUpForm.value.password!,
        confirmPassword: this.signUpForm.value.confirmPassword!,
      })
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
