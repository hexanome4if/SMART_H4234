package fr.insa_lyon.smart_back.controller;

import fr.insa_lyon.smart_back.model.Education;
import fr.insa_lyon.smart_back.model.Tag;
import fr.insa_lyon.smart_back.service.EducationService;
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
public class EducationController {

    @Autowired
    private EducationService educationService;
    @Autowired
    private TagService tagService;

    @GetMapping("/education/user/{userId}")
    public Iterable<Education> getEducationsByUserId(@PathVariable(value = "userId") Long userId) {
        return educationService.getEducationsByUserId(userId);
    }

    @GetMapping("/education/{id}")
    public ResponseEntity< Education > getEducationById(@PathVariable(value = "id") Long educationId)
            throws Exception {
        Education education = educationService.getEducation(educationId)
                .orElseThrow(() -> new Exception("Education not found for this id :: " + educationId));
        return ResponseEntity.ok().body(education);
    }

    @PostMapping("/education")
    public Education createEducation(@Valid @RequestBody Education education) {
        return educationService.saveEducation(education);
    }

    @PutMapping("/education/{id}")
    public ResponseEntity < Education > updateEducation(@PathVariable(value = "id") Long educationId,
                                              @Valid @RequestBody Education educationDetails) throws Exception {
        Education education = educationService.getEducation(educationId)
                .orElseThrow(() -> new Exception("Education not found for this id :: " + educationId));

        education.setInstituteId(educationDetails.getInstituteId());
        education.setYearBegin(educationDetails.getYearBegin());
        education.setYearEnd(educationDetails.getYearEnd());
        education.setDescription(educationDetails.getDescription());
        education.setLabel(educationDetails.getLabel());
        List<Tag> educationTags = educationDetails.getEducationTags();
        List<Long> ids = new ArrayList<>();
        for (Tag t: educationTags) { //Ajout ou modif de tags
            List<Tag> tags = tagService.getTagByLablel(t.getLabel());
            Tag baseTag;
            if (tags.size() == 0) {
                baseTag = tagService.saveTag(t);
            } else {
                baseTag=tags.get(0);
            }
            tagService.setTagEducation(baseTag.getTagId(),educationId);
            ids.add(baseTag.getTagId());
        }
        List<Long> tagIds = tagService.getTagsEducation(educationId);
        for (Long id: tagIds) { //Suppression de tags
            if(!ids.contains(id)) {
                tagService.deleteTagEducation(id,educationId);
            }
        }
        final Education updatedEducation = educationService.saveEducation(education);
        return ResponseEntity.ok(updatedEducation);
    }

    @DeleteMapping("/education/{id}")
    public Map< String, Boolean > deleteEducation(@PathVariable(value = "id") Long educationId)
            throws Exception {
        Education education = educationService.getEducation(educationId)
                .orElseThrow(() -> new Exception("Education not found for this id :: " + educationId));
        Education educationDetails = educationService.getEducation(educationId).get();
        List<Tag> educationTags = educationDetails.getEducationTags();
        List<Long> ids = new ArrayList<>();
        for (Tag t: educationTags) { //Ajout ou modif de tags
            tagService.deleteTagEducation(t.getTagId(),educationId);
        }

        educationService.deleteEducation(educationId);
        Map < String, Boolean > response = new HashMap< >();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

}
