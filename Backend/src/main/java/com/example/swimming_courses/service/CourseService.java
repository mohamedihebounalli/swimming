package com.example.swimming_courses.service;

import com.example.swimming_courses.model.Course;
import com.example.swimming_courses.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course courseDetails) {
        Optional<Course> course = courseRepository.findById(id);
        if (course.isPresent()) {
            Course existingCourse = course.get();
            existingCourse.setTitle(courseDetails.getTitle());
            existingCourse.setDescription(courseDetails.getDescription());
            existingCourse.setDate(courseDetails.getDate());
            existingCourse.setStartTime(courseDetails.getStartTime());
            existingCourse.setEndTime(courseDetails.getEndTime());
            existingCourse.setLocation(courseDetails.getLocation());
            existingCourse.setTotalPlaces(courseDetails.getTotalPlaces());
            existingCourse.setEnrolledCount(courseDetails.getEnrolledCount());
            existingCourse.setLevel(courseDetails.getLevel());
            return courseRepository.save(existingCourse);
        } else {
            return null;
        }
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    // ✅ Nouvelle méthode pour incrémenter le nombre de participants
    public Course incrementEnrollment(Long id) {
        Optional<Course> optionalCourse = courseRepository.findById(id);
        if (optionalCourse.isPresent()) {
            Course course = optionalCourse.get();
            int currentCount = course.getEnrolledCount() != null ? course.getEnrolledCount() : 0;
            course.setEnrolledCount(currentCount + 1);
            return courseRepository.save(course);
        } else {
            throw new RuntimeException("Course not found with id: " + id);
        }
    }
}
