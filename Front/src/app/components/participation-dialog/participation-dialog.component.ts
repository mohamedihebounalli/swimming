import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from '../../models/course.model';
import { EmailService } from '../../services/email.service';
import { ConfirmationEmailComponent } from '../confirmation-email/confirmation-email.component';

@Component({
  selector: 'app-participation-dialog',
  templateUrl: './participation-dialog.component.html',
  styleUrls: ['./participation-dialog.component.scss']
})
export class ParticipationDialogComponent {
  participationForm: FormGroup;
  quizForm: FormGroup;
  showCertificateUpload = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  validationStatus: 'loading' | 'success' | 'error' | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private dialogRef: MatDialogRef<ParticipationDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public course: Course,
    private emailService: EmailService,
    private dialog: MatDialog
  ) {
    this.participationForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
      age: ['', [Validators.required, Validators.min(4), Validators.max(100)]],
      email: ['', [Validators.required, Validators.email]],
      certificate: [null]
    });

    this.quizForm = this.fb.group({
      knowSwimming: ['', Validators.required],
      lengths: ['', Validators.required]
    });

    this.showCertificateUpload = course.level === 'professional';
  }

  isCertificateValid(): boolean {
    return this.course.level !== 'professional' || this.validationStatus === 'success';
  }

  submit(): void {
    if (this.participationForm.valid && this.isCertificateValid()) {
      const data = {
        ...this.participationForm.value,
        courseId: this.course.id,
        level: this.course.level
      };

      const dialogRef = this.dialog.open(ConfirmationEmailComponent, {
        width: '400px',
        data: { email: this.participationForm.value.email }
      });

      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          this.emailService.sendEmail({
            user_name: `${data.prenom} ${data.nom}`,
            user_email: data.email,
            course_title: this.course.title
          }).subscribe(() => console.log("✅ Email envoyé avec succès"));
        }

        this.dialogRef.close(data);
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.participationForm.patchValue({ certificate: this.selectedFile });
      if (this.selectedFile) {
        this.validateCertificate(this.selectedFile);
      }
    }
  }

  openFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.removeDragOverClass(event);

    if (event.dataTransfer?.files.length) {
      this.selectedFile = event.dataTransfer.files[0];
      this.participationForm.patchValue({ certificate: this.selectedFile });
      if (this.selectedFile) {
        this.validateCertificate(this.selectedFile);
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.add('dragover');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.removeDragOverClass(event);
  }

  removeDragOverClass(event: DragEvent) {
    (event.currentTarget as HTMLElement).classList.remove('dragover');
  }

  validateCertificate(file: File) {
    this.validationStatus = 'loading';
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const totalPixels = imageData.width * imageData.height;

        let whitePixels = 0;
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > 230 && data[i + 1] > 230 && data[i + 2] > 230) {
            whitePixels++;
          }
        }

        const whiteRatio = whitePixels / totalPixels;
        const result = whiteRatio > 0.4 ? 'success' : 'error';

        // Forcer un minimum de 3 secondes de "loading"
        setTimeout(() => {
          this.previewUrl = img.src;
          this.validationStatus = result;
        }, 1200);
      };
    };

    reader.readAsDataURL(file);
  }
}
