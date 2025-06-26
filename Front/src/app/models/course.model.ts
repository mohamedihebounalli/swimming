export interface Course {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  totalPlaces: number;
  enrolledCount: number;
  level: 'beginner' | 'intermediate' | 'professional';
}

export interface CreateCourseDto {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  totalPlaces: number;
  level: 'beginner' | 'intermediate' | 'professional';
}

  export interface CourseFilter {
    upcomingOnly?: boolean;
  }