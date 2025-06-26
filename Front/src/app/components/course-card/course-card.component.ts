import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Course } from '../../models/course.model';
import { ParticipationDialogComponent } from '../participation-dialog/participation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent {
  constructor(private dialog: MatDialog, private courseService: CourseService) {}

  @Input() course!: Course;
  @Input() showActions: boolean = false;
  @Input() viewMode: 'admin' | 'user' = 'user';

  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  get availablePlaces(): number {
    return this.course.totalPlaces - (this.course.enrolledCount || 0);
  }

  get isUpcoming(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(this.course.date) >= today;
  }

formatDate(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return parsedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}


  onEdit(): void {
    this.edit.emit(this.course.id);
  }

  onDelete(): void {
    this.delete.emit(this.course.id);
  }

  openParticipationDialog(): void {
    const dialogRef = this.dialog.open(ParticipationDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: true,
      data: this.course
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.courseId === this.course.id) {
        this.courseService.incrementEnrollment(this.course.id).subscribe({
          next: (updatedCourse) => {
            this.course.enrolledCount = updatedCourse.enrolledCount;
          },
          error: (err) => {
            console.error('Enrollment failed', err);
          }
        });
      }
    });
  }
}
