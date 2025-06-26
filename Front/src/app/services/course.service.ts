import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Course, CreateCourseDto } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8080/api/courses';
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  private setLoading(state: boolean) {
    this.loadingSubject.next(state);
  }

  getAllCourses(): Observable<Course[]> {
    this.setLoading(true);
    return this.http.get<Course[]>(this.apiUrl).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  getCourseById(id: number): Observable<Course> {
    this.setLoading(true);
    return this.http.get<Course>(`${this.apiUrl}/${id}`).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  createCourse(course: CreateCourseDto): Observable<Course> {
    this.setLoading(true);
    return this.http.post<Course>(this.apiUrl, course).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  updateCourse(id: number, course: Partial<Course>): Observable<Course> {
    this.setLoading(true);
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  deleteCourse(id: number): Observable<void> {
    this.setLoading(true);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  incrementEnrollment(id: number): Observable<Course> {
    this.setLoading(true);
    return this.http.patch<Course>(`${this.apiUrl}/${id}/enroll`, {}).pipe(
      finalize(() => this.setLoading(false))
    );
  }
}
