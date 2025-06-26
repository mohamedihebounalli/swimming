package com.example.swimming_courses.repository;

import com.example.swimming_courses.model.Participation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    List<Participation> findByCourseId(Long courseId);
}
