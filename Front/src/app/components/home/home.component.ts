import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  courses$!: Observable<Course[]>;
  loading$!: Observable<boolean>;
  loading = false;

  filter = {
    upcomingOnly: true
  };

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loading$ = of(this.loading);
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.loading$ = of(true);

    this.courseService.getAllCourses().subscribe(
      (courses) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filteredCourses = this.filter.upcomingOnly
          ? courses.filter(course => new Date(course.date) >= today)
          : courses;

        this.courses$ = of(filteredCourses);
        this.loading = false;
        this.loading$ = of(false);
      },
      (error) => {
        console.error('Error fetching courses:', error);
        this.courses$ = of([]);
        this.loading = false;
        this.loading$ = of(false);
      }
    );
  }

  toggleUpcomingFilter(): void {
    this.filter.upcomingOnly = !this.filter.upcomingOnly;
    this.loadCourses();
  }
}
