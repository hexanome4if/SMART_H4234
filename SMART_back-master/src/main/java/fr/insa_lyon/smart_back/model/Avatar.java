package fr.insa_lyon.smart_back.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity(name="Avatar")
@Table(name="avatar")
public class Avatar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long avatarId;

    @Column(
            name = "name",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String name;

    @Column(
            name = "photo",
            nullable = false
    )
    private String photo;

    public Avatar() {
    }

    public Avatar(String name, String photo) {
        this.name = name;
        this.photo = photo;
    }
}