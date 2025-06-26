import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;
  isEditMode = false;
  courseId: number | null = null;
  loading$: Observable<boolean>;
  
  timePattern = '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$';
  minDate = new Date();

  locations = ['Main Pool', 'Outdoor Pool', 'Training Room', 'Kids Pool'];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loading$ = this.courseService.loading$;
    this.minDate.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    this.initForm();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.courseId = +idParam;
      this.isEditMode = true;
      this.loadCourseData(this.courseId);
    }
  }

  initForm(): void {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      date: [new Date(), Validators.required],
      startTime: ['09:00', [Validators.required, Validators.pattern(this.timePattern)]],
      endTime: ['10:30', [Validators.required, Validators.pattern(this.timePattern)]],
      location: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      totalPlaces: [15, [Validators.required, Validators.min(1), Validators.max(100)]],
      level: ['beginner', Validators.required]
    }, { validators: this.timeRangeValidator });
  }

  timeRangeValidator(form: FormGroup): { [key: string]: boolean } | null {
    const start = CourseFormComponent.convertTimeToMinutes(form.get('startTime')?.value);
    const end = CourseFormComponent.convertTimeToMinutes(form.get('endTime')?.value);
    return end <= start ? { 'invalidTimeRange': true } : null;
  }

  private static convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  loadCourseData(id: number): void {
    this.courseService.getCourseById(id).subscribe(course => {
      if (course) {
        this.courseForm.patchValue({
          title: course.title,
          description: course.description,
          date: new Date(course.date),
          startTime: course.startTime,
          endTime: course.endTime,
          location: course.location,
          totalPlaces: course.totalPlaces,
          level: course.level
        });
      } else {
        this.router.navigate(['/courses-management']);
      }
    });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.markFormGroupTouched(this.courseForm);
      return;
    }

    const courseData = this.courseForm.value;

    if (this.isEditMode && this.courseId !== null) {
      this.courseService.updateCourse(this.courseId, courseData).subscribe(() => {
        this.router.navigate(['/courses-management']);
      });
    } else {
      this.courseService.createCourse(courseData).subscribe(() => {
        this.router.navigate(['/courses-management']);
      });
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/courses-management']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.courseForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) return `Minimum length is ${control.errors['minlength'].requiredLength}`;
    if (control.errors['maxlength']) return `Maximum length is ${control.errors['maxlength'].requiredLength}`;
    if (control.errors['pattern']) return 'Time must be in HH:MM format';
    if (control.errors['min']) return `Minimum value is ${control.errors['min'].min}`;
    if (control.errors['max']) return `Maximum value is ${control.errors['max'].max}`;
    return 'Invalid value';
  }

  hasTimeRangeError(): boolean {
    return !!this.courseForm.errors?.['invalidTimeRange'] &&
           !!this.courseForm.get('startTime')?.touched &&
           !!this.courseForm.get('endTime')?.touched;
  }
}
