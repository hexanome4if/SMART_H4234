package fr.insa_lyon.smart_back.controller;

import fr.insa_lyon.smart_back.model.Level;
import fr.insa_lyon.smart_back.service.LevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LevelController {

    @Autowired
    private LevelService levelService;

    @GetMapping("/levels")
    public Iterable<Level> getAllLevels() {
        return levelService.getLevels();
    }

}
