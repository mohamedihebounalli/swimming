package com.example.swimming_courses.controller;

import com.example.swimming_courses.model.Participation;
import com.example.swimming_courses.service.ParticipationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participations")
@CrossOrigin(origins = "*")
public class ParticipationController {

    private final ParticipationService service;

    public ParticipationController(ParticipationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Participation> getAll() {
        return service.getAllParticipations();
    }

    @GetMapping("/course/{courseId}")
    public List<Participation> getByCourse(@PathVariable Long courseId) {
        return service.getByCourse(courseId);
    }

    @PostMapping
    public ResponseEntity<Participation> create(@RequestBody Participation participation) {
        return ResponseEntity.ok(service.saveParticipation(participation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteParticipation(id);
        return ResponseEntity.noContent().build();
    }
}
