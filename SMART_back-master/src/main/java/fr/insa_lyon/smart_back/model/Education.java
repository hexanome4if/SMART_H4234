package fr.insa_lyon.smart_back.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "EDUCATION")
@Data
public class Education {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long educationId;
    @Column(name = "institute_id")
    private String instituteId;
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
    //@JoinColumn(name = "user_id", insertable = false, updatable = false)
    //private User user;


    @ManyToMany
    @JoinTable(
    name = "EDUCATIONTAG",
    joinColumns = @JoinColumn(name = "education_id"),
    inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private List<Tag> educationTags;

    public Education() {

    }

    public Education(Date yearBegin, String description) {
        this.yearBegin = yearBegin;
        this.description = description;
    }
}
