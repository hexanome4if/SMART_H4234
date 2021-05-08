package fr.insa_lyon.smart_back.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
@Entity(name="User")
@Table(name="user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;

    @Column(
            name = "user_name",
            nullable = false,
            columnDefinition = "TEXT",
            unique = true
    )
    private String userName;

    @Column(
            name = "display_name",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String displayName;

    @Column(
            name = "mail",
            nullable = false,
            columnDefinition = "TEXT",
            unique = true
    )
    private String mail;

    @Column(
            name = "password",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String password;

    @Column(
            name = "birth",
            nullable = false,
            columnDefinition = "DATE"
    )
    private Date birth;

    @Column(
            name = "tel",
            columnDefinition = "TEXT"
    )
    private String tel;

    @Column(
            name = "counselor",
            nullable = false
    )
    private boolean counselor;

    @Column(
            name = "verify",
            nullable = false
    )
    private boolean verify;

    @Column(
            name = "status",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String status;

    @Column(
            name = "photo",
            columnDefinition = "TEXT"
    )
    private String photo;

    @Column(
            name = "identity_document",
            columnDefinition = "TEXT"
    )
    private String identityDocument;

    @Column(
            name = "device",
            columnDefinition = "TEXT"
    )
    private String device;

    @Column(
            name = "level_id"
    )
    private long levelId;

    @ManyToOne
    @JoinColumn(name = "level_id", insertable = false, updatable = false)
    private Level level;

    @Column(
            name = "avatar_id",
            nullable = false
    )
    private long avatarId;

    @ManyToOne
    @JoinColumn(name = "avatar_id", insertable = false, updatable = false)
    private Avatar avatar;

    @ManyToMany
    @JoinTable(
            name = "USERABILITYTAG",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> userAbilityTags;

    @ManyToMany
    @JoinTable(
            name = "USERINTERESTSTAG",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> userInterestTags;

    @OneToMany
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    public List<Experience> experiences;

    @OneToMany
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    public List<Education> educations;


    public User() {
    }

    public User(String userName, String displayName, String mail, String password, Date birth, boolean counselor, boolean verify, String status, Avatar avatar) {
        this.userName = userName;
        this.displayName = displayName;
        this.mail = mail;
        this.password = password;
        this.birth = birth;
        this.counselor = counselor;
        this.verify = verify;
        this.status = status;
        this.avatar = avatar;
    }
}