package fr.insa_lyon.smart_back.model;

import lombok.Data;

@Data
public class Greeting { //Objet a renvoyer en JSON
    private long id;
    private final String content;

    public Greeting(long id, String content) {
        this.id = id;
        this.content = content;
    }
}
