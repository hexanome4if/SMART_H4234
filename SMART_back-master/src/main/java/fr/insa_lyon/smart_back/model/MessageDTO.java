package fr.insa_lyon.smart_back.model;

import lombok.Data;

@Data
public class MessageDTO {

    private String type;
    private String content;

    public MessageDTO() {
    }
}
