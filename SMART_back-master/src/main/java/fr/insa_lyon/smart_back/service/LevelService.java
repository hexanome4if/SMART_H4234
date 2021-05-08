package fr.insa_lyon.smart_back.service;

import fr.insa_lyon.smart_back.model.Level;
import fr.insa_lyon.smart_back.repository.LevelRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Data
@Service
public class LevelService {

    @Autowired // C'est Spring qui va s'occuper de l'instentiation
    private LevelRepository levelRepository;

    public Iterable<Level> getLevels() {
        return levelRepository.findAll();
    }
}
