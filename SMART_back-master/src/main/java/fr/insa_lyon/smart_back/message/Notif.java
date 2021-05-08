package fr.insa_lyon.smart_back.message;

import lombok.Data;

@Data
public class Notif {
    private String message;
    private String status;
    private int duration;
    private boolean cantRemove;
    private String buttonTitle;
    private String pageAction;

    public Notif(String message, String status, int duration, boolean cantRemove, String buttonTitle, String pageAction) {
        this.message = message;
        this.status = status;
        this.duration = duration;
        this.cantRemove = cantRemove;
        this.buttonTitle = buttonTitle;
        this.pageAction = pageAction;
    }

    public Notif(String message, String status, int duration, boolean cantRemove) {
        this.message = message;
        this.status = status;
        this.duration = duration;
        this.cantRemove = cantRemove;
        this.buttonTitle = "";
        this.pageAction = "";
    }

    public Notif(String message, String status, int duration) {
        this.message = message;
        this.status = status;
        this.duration = duration;
        this.cantRemove = false;
        this.buttonTitle = "";
        this.pageAction = "";
    }
}
