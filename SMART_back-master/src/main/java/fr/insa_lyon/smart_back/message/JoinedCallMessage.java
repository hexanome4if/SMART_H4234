package fr.insa_lyon.smart_back.message;

public class JoinedCallMessage {
    private String type = "joined";
    private Long meetingId;

    public JoinedCallMessage(Long meetingId) {
        this.meetingId = meetingId;
    }
}