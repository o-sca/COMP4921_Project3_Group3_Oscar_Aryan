import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProfileService } from '../core/services/profile.service';

@Component({
  templateUrl: './profile-edit-dialog.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatDialogTitle,
    MatFormFieldModule,
  ],
})
export class ProfileEditDialogComponent {
  file?: File;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { profilePicUrl: string },
    private profile: ProfileService,
  ) {}

  updateProfilePic(file?: File) {
    if (!file) return;
    this.profile.uploadProfilePic(file).subscribe();
  }

  selectFile(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.file = element.files[0];
    }
  }
}
