package fr.insa_lyon.smart_back.controller;

import fr.insa_lyon.smart_back.controller.json_classes.Suggestion;
import fr.insa_lyon.smart_back.model.Tag;
import fr.insa_lyon.smart_back.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

@RestController
public class TagController {

    @Autowired
    private TagService tagService;
    

    @GetMapping("/tag/{id}")
    public ResponseEntity<Tag> getTagById(@PathVariable(value = "id") Long tagId)
            throws Exception {
        Tag tag = tagService.getTag(tagId)
                .orElseThrow(() -> new Exception("Tag not found for this id :: " + tagId));
        return ResponseEntity.ok().body(tag);
    }

    @PostMapping("/tag")
    public Tag createTag(@Valid @RequestBody Tag tag) {
        return tagService.saveTag(tag);
    }

    @PutMapping("/tag/{id}")
    public ResponseEntity < Tag > updateTag(@PathVariable(value = "id") Long tagId,
                                              @Valid @RequestBody Tag tagDetails) throws Exception {
        Tag tag = tagService.getTag(tagId)
                .orElseThrow(() -> new Exception("Tag not found for this id :: " + tagId));

        tag.setLabel(tagDetails.getLabel());
        final Tag updatedTag = tagService.saveTag(tag);
        return ResponseEntity.ok(updatedTag);
    }

    @DeleteMapping("/tag/{id}")
    public Map< String, Boolean > deleteTag(@PathVariable(value = "id") Long tagId)
            throws Exception {
        Tag tag = tagService.getTag(tagId)
                .orElseThrow(() -> new Exception("Tag not found for this id :: " + tagId));

        tagService.deleteTag(tagId);
        Map < String, Boolean > response = new HashMap< >();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

    @PostMapping("/suggestion/{userId}")
    public List<Suggestion> getSuggestions(@RequestParam(value = "nb", defaultValue = "0") int nb, @RequestParam(value = "page", defaultValue = "0") int page, @RequestBody List<Tag> tags, @PathVariable(value = "userId") Long userId) {
        List<String> tag_labels = new ArrayList<>();
        for (Tag t: tags) {
            tag_labels.add(t.getLabel());
        }
        List<Suggestion> suggestions = new ArrayList<>();
        tagService.getSuggestions(tag_labels, userId).forEach((key, value) -> suggestions.add(new Suggestion(key, (TreeMap<Double, List<String>>) value)));
        Collections.sort(suggestions, new Suggestion());
        if(page != 0 && nb==0) {
            nb=10; // 10 par page par défaut
        }
        if(page!=0 && (page-1)*nb<suggestions.size() && nb>suggestions.size()) {
            int indexEnd = (page-1)*nb+nb;
            if(indexEnd > suggestions.size()) {
                indexEnd = suggestions.size();
            }
            return suggestions.subList((page-1)*nb,indexEnd);
        }
        if(nb !=0 && nb<suggestions.size()) {
            return suggestions.subList(0,nb);
        }
        return suggestions;
    }

    /*
    * Pour tester :
        [
            {
                "tagId": 1,
                "label": "testTag"
            },
            {
                "tagId": 2,
                "label": "testTag"
            },
            {
                "tagId": 3,
                "label": "tag EXP"
            }
        ]
    * */

}

