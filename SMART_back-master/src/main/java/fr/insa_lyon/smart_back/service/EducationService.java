package fr.insa_lyon.smart_back.service;

import fr.insa_lyon.smart_back.model.Education;
import fr.insa_lyon.smart_back.repository.EducationRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Data
@Service
public class EducationService {

    @Autowired // C'est Spring qui va s'occuper de l'instentiation
    private EducationRepository educationRepository;

    public Iterable<Education> getEducationsByUserId(long userId) {
        return educationRepository.findByUserId(userId);
    }

    public Optional<Education> getEducation(final long id) {
        return educationRepository.findById(id);
    }

    public Education saveEducation(Education education) {
        Education savedEducation = educationRepository.save(education);
        return savedEducation;
    }

    public void deleteEducation(final long id) {
        educationRepository.deleteById(id);
    }

    public List<Long> getUserIdsByInstituteId(final String instituteId) {
        return educationRepository.getUserIdsByInstituteId(instituteId);
    }

    public List<Long> getUserIdsByLabel(final String label) {
        return educationRepository.getUserIdsByLabel(label);
    }
}
