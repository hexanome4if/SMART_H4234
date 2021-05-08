package fr.insa_lyon.smart_back.model;

import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "TAG")
@Data
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long tagId;
    @Column(name = "label", nullable = false)
    private String label;
    /*@ManyToMany(mappedBy = "educationTags")
    private List<Education> educations;
    @ManyToMany(mappedBy = "experienceTags")
    private List<Experience> experiences;
    @ManyToMany(mappedBy = "userAbilityTags")
    private List<User> usersAbilities;
    @ManyToMany(mappedBy = "userInterestTags")
    private List<User> usersInterests;*/

    public Tag() {

    }

    public Tag(String label) {
        this.label = label;
    }
}
