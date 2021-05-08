package fr.insa_lyon.smart_back.controller;

import fr.insa_lyon.smart_back.model.Experience;
import fr.insa_lyon.smart_back.model.Tag;
import fr.insa_lyon.smart_back.service.ExperienceService;
import fr.insa_lyon.smart_back.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ExperienceController {

    @Autowired
    private ExperienceService experienceService;
    @Autowired
    private TagService tagService;

    @GetMapping("/experience/user/{userId}")
    public Iterable<Experience> getExperiencesByUserId(@PathVariable(value = "userId") Long userId) {
        return experienceService.getExperiencesByUserId(userId);
    }

    @GetMapping("/experience/{id}")
    public ResponseEntity<Experience> getExperienceById(@PathVariable(value = "id") Long experienceId)
            throws Exception {
        Experience experience = experienceService.getExperience(experienceId)
                .orElseThrow(() -> new Exception("Experience not found for this id :: " + experienceId));
        return ResponseEntity.ok().body(experience);
    }


    @PostMapping("/experience")
    public Experience createExperience(@Valid @RequestBody Experience experience) {
        return experienceService.saveExperience(experience);
    }

    @PutMapping("/experience/{id}")
    public ResponseEntity< Experience > updateExperience(@PathVariable(value = "id") Long experienceId,
                                                       @Valid @RequestBody Experience experienceDetails) throws Exception {
        Experience experience = experienceService.getExperience(experienceId)
                .orElseThrow(() -> new Exception("Experience not found for this id :: " + experienceId));

        experience.setSiret(experienceDetails.getSiret());
        experience.setYearBegin(experienceDetails.getYearBegin());
        experience.setYearEnd(experienceDetails.getYearEnd());
        experience.setDescription(experienceDetails.getDescription());
        experience.setLabel(experienceDetails.getLabel());
        List<Tag> experienceTags = experienceDetails.getExperienceTags();
        List<Long> ids = new ArrayList<>();
        for (Tag t: experienceTags) { //Ajout ou modif de tags
            List<Tag> tags = tagService.getTagByLablel(t.getLabel());
            Tag baseTag;
            if (tags.size() == 0) {
                baseTag = tagService.saveTag(t);
            } else {
                baseTag=tags.get(0);
            }
            tagService.setTagExperience(baseTag.getTagId(),experienceId);
            ids.add(baseTag.getTagId());
        }
        List<Long> tagIds = tagService.getTagsExperience(experienceId);
        for (Long id: tagIds) { //Suppression de tags
            if(!ids.contains(id)) {
                tagService.deleteTagExperience(id,experienceId);
            }
        }
        final Experience updatedExperience = experienceService.saveExperience(experience);
        return ResponseEntity.ok(updatedExperience);
    }

    @DeleteMapping("/experience/{id}")
    public Map< String, Boolean > deleteExperience(@PathVariable(value = "id") Long experienceId)
            throws Exception {
        Experience experience = experienceService.getExperience(experienceId)
                .orElseThrow(() -> new Exception("Experience not found for this id :: " + experienceId));

        experienceService.deleteExperience(experienceId);
        Experience experienceDetails = experienceService.getExperience(experienceId).get();
        List<Tag> experienceTags = experienceDetails.getExperienceTags();
        List<Long> ids = new ArrayList<>();
        for (Tag t: experienceTags) { //Ajout ou modif de tags
            tagService.deleteTagExperience(t.getTagId(),experienceId);
        }
        Map < String, Boolean > response = new HashMap< >();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

}
