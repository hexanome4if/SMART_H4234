package fr.insa_lyon.smart_back.controller;

import fr.insa_lyon.smart_back.model.Meeting;
import fr.insa_lyon.smart_back.model.User;
import fr.insa_lyon.smart_back.service.ParticipantMeetingService;
import fr.insa_lyon.smart_back.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class ParticipantMeetingController {

    @Autowired
    private ParticipantMeetingService participantMeetingService;

    @Autowired
    private UserService userService;

    @GetMapping("/getPlannedMeetings/{id}")
    public Iterable<Meeting> getPlannedMeetings(@PathVariable(value = "id") Long userId) throws Exception {

        User u = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("User not found for this id :: " + userId ));

        return participantMeetingService.listPlannedMeeting(u);
    }

    @GetMapping("/getSentMeetings/{id}")
    public Iterable<Meeting> getSentMeetings(@PathVariable(value = "id") Long userId) throws Exception {

        User u = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("User not found for this id :: " + userId ));

        return participantMeetingService.listSentMeeting(u);
    }

    @GetMapping("/getCancelledMeetings/{id}")
    public Iterable<Meeting> getCancelledMeetings(@PathVariable(value = "id") Long userId) throws Exception {

        User u = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("User not found for this id :: " + userId ));

        return participantMeetingService.listCancelledMeeting(u);
    }

    @GetMapping("/getReceivedMeetings/{id}")
    public Iterable<Meeting> getReceivedMeetings(@PathVariable(value = "id") Long userId) throws Exception {

        User u = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("User not found for this id :: " + userId ));

        return participantMeetingService.listReceivedMeeting(u);
    }

    /*
    @GetMapping("/getAcceptedMeetings/{id}")
    public Iterable<Meeting> getAcceptedMeetings(@PathVariable(value = "id") Long userId) throws Exception {

        User u = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("User not found for this id :: " + userId ));

        return participantMeetingService.listAcceptedMeeting(u);
    }

    @GetMapping("/getNotAcceptedMeetings/{id}")
    public Iterable<Meeting> getNotAcceptedMeetings(@PathVariable(value = "id") Long userId) throws Exception {

        User u = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("User not found for this id :: " + userId ));

        return participantMeetingService.listNotAcceptedMeeting(u);
    }
    */
}
