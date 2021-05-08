package fr.insa_lyon.smart_back.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "EXPERIENCE")
@Data
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long experienceId;

    @Column(name = "siret")
    private String siret;

    @Column(name = "year_begin", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date yearBegin;

    @Column(name = "year_end")
    @Temporal(TemporalType.DATE)
    private Date yearEnd;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "label")
    private String label;

    @Column(
            name = "user_id"
    )
    private long userId;

    //@ManyToOne
    //private User user;

    @ManyToMany
    @JoinTable(
    name = "EXPERIENCETAG",
    joinColumns = @JoinColumn(name = "experience_id"),
    inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private List<Tag> experienceTags;

    public Experience() {

    }

    public Experience(Date yearBegin) {
        this.yearBegin = yearBegin;
    }
}
