package fr.insa_lyon.smart_back.model;

import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity(name="Level")
@Table(name="level")
public class Level {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long levelId;

    @Column(
            name = "label",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String label;

    //@OneToMany
    //private List<User> usersL;

    public Level() {
    }

    public Level(String label) {
        this.label = label;
    }
}