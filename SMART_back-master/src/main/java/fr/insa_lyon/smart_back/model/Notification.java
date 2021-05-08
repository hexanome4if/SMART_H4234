package fr.insa_lyon.smart_back.model;

import lombok.Data;

import java.util.Date;

@Data
public class Notification {

    private long userId;
    private String type;
    private String content;
    private Date time;

    public Notification() {}

    public Notification(long id, String type, String cnt) {
        this.type = type;
        userId = id;
        content = cnt;
        time = new Date(System.currentTimeMillis());
    }

    public Notification(long id, String type, String cnt, Date date) {
        this.type = type;
        userId = id;
        content = cnt;
        time = date;
    }
}
