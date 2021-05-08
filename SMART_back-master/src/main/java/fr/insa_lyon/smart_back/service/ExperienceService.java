package fr.insa_lyon.smart_back.service;

import fr.insa_lyon.smart_back.model.Experience;
import fr.insa_lyon.smart_back.repository.ExperienceRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Data
@Service
public class ExperienceService {

    @Autowired // C'est Spring qui va s'occuper de l'instentiation
    private ExperienceRepository experienceRepository;

    public Iterable<Experience> getExperiencesByUserId(long userId) {
        return experienceRepository.findByUserId(userId);
    }

    public Optional<Experience> getExperience(final long id) {
        return experienceRepository.findById(id);
    }

    public Experience saveExperience(Experience experience) {
        Experience savedExperience = experienceRepository.save(experience);
        return savedExperience;
    }

    public void deleteExperience(final long id) {
        experienceRepository.deleteById(id);
    }

    public List<Long> getUserIdsBySiret(final String siret) {
        return experienceRepository.getUserIdsBySiret(siret);
    }
}
