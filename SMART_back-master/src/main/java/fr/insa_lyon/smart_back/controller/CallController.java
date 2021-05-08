package fr.insa_lyon.smart_back.controller;

import fr.insa_lyon.smart_back.model.Meeting;
import fr.insa_lyon.smart_back.model.User;
import fr.insa_lyon.smart_back.repository.MeetingRepository;
import fr.insa_lyon.smart_back.service.CallRoomService;
import fr.insa_lyon.smart_back.service.MeetingService;
import fr.insa_lyon.smart_back.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;

@Controller
@Component
public class CallController implements ApplicationListener<SessionDisconnectEvent> {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private MeetingService meetingService;

    @Autowired
    private UserService userService;

    @MessageMapping("/call/create-or-join/{meetingId}")
    public void createOrJoin(@DestinationVariable("meetingId") Long meetingId, Principal principal) {
        User user = userService.getUserByUserName(principal.getName()).orElse(null);
        if (user == null) return;
        System.out.println("User ok " + user.getUserId());

        System.out.println("Meetingid is " + meetingId);
        Meeting meeting = meetingService.getMeetingById(meetingId).orElse(null);
        if (meeting == null) return;
        System.out.println("Meeting ok hello");
        // Here we could check other things (meeting date and time for exemple, user is part of the meeting)
        try {
            CallRoomService.CallRoom callRoom = CallRoomService.getInstance().findByMeeting(meeting);
            System.out.println("Call room " + callRoom);
            if (callRoom == null) {
                callRoom = new CallRoomService.CallRoom(meeting);
                callRoom.create(user, simpMessagingTemplate);
            } else {
                callRoom.join(user, simpMessagingTemplate);
            }
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    @MessageMapping("/call/message/{meetingId}")
    public void message(@DestinationVariable("meetingId") Long meetingId, @Payload String payload, Principal principal) {
        User user = userService.getUserByUserName(principal.getName()).orElse(null);
        if (user == null) return;
        System.out.println("User ok");

        System.out.println("Meetingid is " + meetingId);
        Meeting meeting = meetingService.getMeetingById(meetingId).orElse(null);
        if (meeting == null) return;
        System.out.println("Meeting ok");

        CallRoomService.CallRoom callRoom = CallRoomService.getInstance().findByMeeting(meeting);
        if (callRoom == null) return;
        System.out.println("Call room ok");

        callRoom.sendMessageExceptUser(payload, user, simpMessagingTemplate);
    }

    @MessageMapping("/call/ipaddr")
    public void ipAddr() {

    }

    @MessageExceptionHandler
    @SendToUser("/queue/errors")
    public String handleException(Throwable exception) {
        System.out.println(exception);
        return exception.getMessage();
    }

    @Override
    public void onApplicationEvent(SessionDisconnectEvent sessionDisconnectEvent) {
        System.out.println("User disconnected");
    }
}