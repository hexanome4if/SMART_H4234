package fr.insa_lyon.smart_back.message;

public class CreatedCallMessage {
    private String type = "created";
    private Long meetingId;

    public CreatedCallMessage(Long meetingId) {
        this.meetingId = meetingId;
    }
}