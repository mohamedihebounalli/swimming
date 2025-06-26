package com.example.swimming_courses.service;

import com.example.swimming_courses.model.Participation;
import com.example.swimming_courses.repository.ParticipationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParticipationService {

    private final ParticipationRepository repository;

    public ParticipationService(ParticipationRepository repository) {
        this.repository = repository;
    }

    public List<Participation> getAllParticipations() {
        return repository.findAll();
    }

    public List<Participation> getByCourse(Long courseId) {
        return repository.findByCourseId(courseId);
    }

    public Participation saveParticipation(Participation p) {
        return repository.save(p);
    }

    public void deleteParticipation(Long id) {
        repository.deleteById(id);
    }
}
