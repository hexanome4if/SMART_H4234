package fr.insa_lyon.smart_back.message;

public class JoinCallMessage {
    private String type = "join";
    private String userName;
    private String userDisplayName;

    public JoinCallMessage(String userName, String userDisplayName) {
        this.userName = userName;
        this.userDisplayName = userDisplayName;
    }
}