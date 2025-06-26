import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-email',
  templateUrl: './confirmation-email.component.html',
  styleUrls: ['./confirmation-email.component.scss']
})
export class ConfirmationEmailComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // User agrees to receive the email
  }

  onCancel(): void {
    this.dialogRef.close(false); // User declines the email
  }
}
