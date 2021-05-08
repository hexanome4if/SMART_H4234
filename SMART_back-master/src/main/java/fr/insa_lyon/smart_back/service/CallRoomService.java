package fr.insa_lyon.smart_back.service;

import com.google.gson.Gson;
import fr.insa_lyon.smart_back.message.CreatedCallMessage;
import fr.insa_lyon.smart_back.message.JoinCallMessage;
import fr.insa_lyon.smart_back.message.JoinedCallMessage;
import fr.insa_lyon.smart_back.model.Meeting;
import fr.insa_lyon.smart_back.model.User;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.ArrayList;
import java.util.List;

public class CallRoomService {

    private static CallRoomService instance = null;
    public static CallRoomService getInstance() {
        if (instance == null) {
            instance = new CallRoomService();
        }
        return instance;
    }

    private final List<CallRoom> rooms = new ArrayList<>();

    private CallRoomService() {}

    public CallRoom findByMeeting(Meeting meeting) {
        for (CallRoom callRoom: rooms) {
            if (meeting.getMeetingId() == callRoom.meeting.getMeetingId()) {
                return callRoom;
            }
        }
        return null;
    }

    public static class CallRoom {
        private final Meeting meeting;
        private final List<User> users = new ArrayList<>();

        public CallRoom(Meeting meeting) {
            CallRoomService.getInstance().rooms.add(this);
            this.meeting = meeting;
        }

        public void create(User initialUser, SimpMessagingTemplate simpMessagingTemplate) {
            this.users.add(initialUser);
            System.out.println("Send create to " + initialUser.getUserName());
            simpMessagingTemplate.convertAndSendToUser(
                    initialUser.getUserName(),
                    "/queue/call/create-or-join/response",
                    (new Gson()).toJson(new CreatedCallMessage(meeting.getMeetingId()))
            );
            // Here we should send a notification to every other people
        }

        public void join(User user, SimpMessagingTemplate simpMessagingTemplate) {
            if (!this.users.contains(user)) {
                this.users.add(user);
            }

            System.out.println("Number of user in room: " + this.users.size());

            simpMessagingTemplate.convertAndSendToUser(
                    user.getUserName(),
                    "/queue/call/create-or-join/response",
                    (new Gson()).toJson(new JoinedCallMessage(meeting.getMeetingId()))
            );

            JoinCallMessage joinCallMessage = new JoinCallMessage(user.getUserName(), user.getDisplayName());
            String message = (new Gson()).toJson(joinCallMessage);
            for (User u: users) {
                if (u.getUserId() != user.getUserId()) {
                    simpMessagingTemplate.convertAndSendToUser(
                            u.getUserName(),
                            "/queue/call/user-join",
                            message
                    );
                }
            }
        }

        public void sendMessageExceptUser(String payload, User avoidUser, SimpMessagingTemplate simpMessagingTemplate) {
            for(User u: users) {
                if (u.getUserId() != avoidUser.getUserId()) {
                    simpMessagingTemplate.convertAndSendToUser(
                            u.getUserName(),
                            "/queue/call/message",
                            payload
                    );
                }
            }
        }
    }
}