package fr.insa_lyon.smart_back.service;

import fr.insa_lyon.smart_back.model.Tag;
import fr.insa_lyon.smart_back.repository.TagRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Data
@Service
public class TagService {

    @Autowired // C'est Spring qui va s'occuper de l'instentiation
    private TagRepository tagRepository;

    public Optional<Tag> getTag(final long id) {
        return tagRepository.findById(id);
    }

    public List<Tag> getTagByLablel(final String label) {
        return tagRepository.findTagByLabel(label);
    }

    public Tag saveTag(Tag tag) {
        Tag savedTag = tagRepository.save(tag);
        return savedTag;
    }

    public void deleteTag(final long id) {
        tagRepository.deleteById(id);
    }

    public void setTagEducation(final long tagId, final long educationId) {
        if(tagRepository.countEducationTag(tagId,educationId) == 0) {
            tagRepository.insertEducationTag(tagId, educationId);
        }
    }

    public List<Long> getTagsEducation(final long educationId) {
        return tagRepository.getTagsEducation(educationId);
    }

    public void deleteTagEducation(final long tagId, final long educationId) {
        tagRepository.deleteTagEducation(tagId, educationId);
    }

    public void setTagExperience(final long tagId, final long experienceId) {
        if(tagRepository.countExperienceTag(tagId,experienceId) == 0) {
            tagRepository.insertExperienceTag(tagId, experienceId);
        }
    }

    public List<Long> getTagsExperience(final long experienceId) {
        return tagRepository.getTagsExperience(experienceId);
    }

    public void deleteTagExperience(final long tagId, final long experienceId) {
        tagRepository.deleteTagExperience(tagId, experienceId);
    }

    public Map<Long, Map<Double, List<String>>> getSuggestions(final List<String> tag_labels, final long userId) {
        Map<Long, Map<Double, List<String>>> suggestions = new TreeMap<>();
        int tag_labels_size = tag_labels.size();
        for (String label: tag_labels) {
            List<Long> users_id = tagRepository.getSuggestions(label);
            for (Long id: users_id) {
                if(id == userId) {
                    continue;
                } else if(suggestions.containsKey(id)){
                    suggestions.computeIfPresent(id,(key,val) -> updateCommun((TreeMap<Double, List<String>>) val, tag_labels_size, label));
                } else {
                    Map<Double, List<String>> commun = new TreeMap<>();
                    List<String> tags = new ArrayList<>();
                    tags.add(label);
                    commun.put(1.0/tag_labels_size, tags);
                    suggestions.put(id,commun);
                }
            }
        }
        return suggestions;
    }

    private Map<Double, List<String>> updateCommun (TreeMap<Double, List<String>> commun, int labels_size, String label) {
        Double note = commun.firstKey();
        List<String> tags = commun.firstEntry().getValue();
        note = note + (1.0/labels_size);
        if(!tags.contains(label)) {
            commun.clear();
            tags.add(label);
            commun.put(note, tags);
        }
        return commun;
    }

}
