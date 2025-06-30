import { Component, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  courses: Course[] = [];

  totalCourses = 0;
  totalEnrolled = 0;
  averageEnrollment = 0;
  fullCourses = 0;

  chartLabels: string[] = [];
  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  levelChartData: ChartData<'pie'> = {
    labels: ['Beginner', 'Intermediate', 'Professional'],
    datasets: []
  };

  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe(courses => {
      this.courses = courses;
      this.computeStats();
      this.prepareCharts();
    });
  }

  computeStats(): void {
    this.totalCourses = this.courses.length;
    this.totalEnrolled = this.courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
    this.averageEnrollment = this.totalCourses ? Math.round(this.totalEnrolled / this.totalCourses) : 0;
    this.fullCourses = this.courses.filter(c => (c.enrolledCount || 0) >= c.totalPlaces).length;
  }

  prepareCharts(): void {
    // Bar Chart - Participants per course
    this.chartLabels = this.courses.map(c => c.title);
    const barData = this.courses.map(c => c.enrolledCount || 0);
    this.chartData = {
      labels: this.chartLabels,
      datasets: [
        {
          label: 'Participants',
          data: barData,
          backgroundColor: '#42A5F5'
        }
      ]
    };

    // Pie Chart - Levels
    const levelCount: any = { beginner: 0, intermediate: 0, professional: 0 };
    this.courses.forEach(c => {
      const level = c.level.toLowerCase();
      if (levelCount[level] !== undefined) {
        levelCount[level]++;
      }
    });
    this.levelChartData = {
      labels: ['Beginner', 'Intermediate', 'Professional'],
      datasets: [{
        data: [
          levelCount['beginner'],
          levelCount['intermediate'],
          levelCount['professional']
        ],
        backgroundColor: ['#66BB6A', '#FFA726', '#AB47BC']
      }]
    };

    // Line Chart - Enrollments over time
    const enrollmentsByDate: { [key: string]: number } = {};
    this.courses.forEach(c => {
      const date = new Date(c.date).toLocaleDateString();
      enrollmentsByDate[date] = (enrollmentsByDate[date] || 0) + (c.enrolledCount || 0);
    });
    const sortedDates = Object.keys(enrollmentsByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const lineData = sortedDates.map(d => enrollmentsByDate[d]);

    this.lineChartData = {
      labels: sortedDates,
      datasets: [
        {
          label: 'Total Enrollments',
          data: lineData,
          fill: true,
          borderColor: '#42A5F5',
          tension: 0.4
        }
      ]
    };
  }
}
