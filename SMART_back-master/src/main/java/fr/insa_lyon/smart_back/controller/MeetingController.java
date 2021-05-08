package fr.insa_lyon.smart_back.controller;

import fr.insa_lyon.smart_back.message.Notif;
import fr.insa_lyon.smart_back.model.Meeting;
import fr.insa_lyon.smart_back.model.ParticipantMeeting;
import fr.insa_lyon.smart_back.model.User;
import fr.insa_lyon.smart_back.service.MeetingService;
import fr.insa_lyon.smart_back.service.NotifService;
import fr.insa_lyon.smart_back.service.ParticipantMeetingService;
import fr.insa_lyon.smart_back.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.Response;

@RestController
public class MeetingController {

    @Autowired
    private MeetingService meetingService;

    @Autowired
    private ParticipantMeetingService participantMeetingService;

    @Autowired
    private UserService userService;

    @Autowired
    private NotifService notifService;


    public void arrangeParticipantToMeeting(Meeting m, User u, boolean init) throws Exception {

        long meetId = m.getMeetingId();
        Meeting meet = meetingService.getMeetingById(meetId)
                .orElseThrow(() -> new Exception("Meeting not found for this id :: " + meetId));

        ParticipantMeeting pm = new ParticipantMeeting();
        pm.setMeeting(m);
        pm.setUser(u);
        pm.setAccepted(false);
        pm.setCancelled(false);
        pm.setInitiator(init);
        participantMeetingService.saveParticipantMeeting(pm);
    }

    @PostMapping("arrangeMeeting/{userId}/{receiverId}")
    public ResponseEntity<Meeting> arrangeMeeting(@RequestBody Meeting meeting, @PathVariable long userId,
                                         @PathVariable long receiverId) throws Exception {

        User u = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("User not found for this id :: " + userId));

        User r = userService.getUserById(receiverId)
                .orElseThrow(() -> new Exception("User (receiver) not found for this id :: " + receiverId));

        Meeting newMeeting = meetingService.saveMeeting(meeting);
        this.arrangeParticipantToMeeting(newMeeting, u, true);
        this.arrangeParticipantToMeeting(newMeeting, r, false);
        notifService.sendNotification(r, new Notif("Nouvelle demande de RDV", "info", 5, false, "Ouvrir", "/meetings"));
        notifService.sendPushNotification(r, "Nouvelle demande de RDV", "RDV demandé par: '" + u.getUserName() +  "'");
        return ResponseEntity.ok(newMeeting);
    }

    @PostMapping("addParticipantMeeting/{meetingId}/{receiverId}")
    public void addParticipantMeeting(@PathVariable long meetingId,
                               @PathVariable long receiverId) throws Exception {

        User r = userService.getUserById(receiverId)
                .orElseThrow(() -> new Exception("User (receiver) not found for this id :: " + receiverId));

        Meeting m = meetingService.getMeetingById(meetingId)
                .orElseThrow(() -> new Exception("Meeting not found for this id :: " + meetingId));

        this.arrangeParticipantToMeeting(m, r, false);
        notifService.sendNotification(r, new Notif("Nouvelle demande de RDV", "info", 5, false, "Ouvrir", "/meetings"));
        notifService.sendPushNotification(r, "Nouvelle demande de RDV", "Nouveau RDV de groupe");
    }

    @PostMapping("/acceptMeeting/{userId}")
    public void acceptMeeting(@RequestBody Meeting meet, @PathVariable long userId) throws Exception {

        User u = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("User not found for this id :: " + userId));

        long meetingId = meet.getMeetingId();
        Meeting m = meetingService.getMeetingById(meetingId)
                .orElseThrow(() -> new Exception("Meeting not found for this id :: " + meetingId));

        participantMeetingService.acceptMeeting(u, m);
    }

    @PostMapping("/refuseMeeting/{userId}")
    public void refuseMeeting(@RequestBody Meeting meet, @PathVariable long userId) throws Exception {

        User u = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("User not found for this id :: " + userId));

        long meetingId = meet.getMeetingId();
        Meeting m = meetingService.getMeetingById(meetingId)
                .orElseThrow(() -> new Exception("Meeting not found for this id :: " + meetingId));

        participantMeetingService.refuseMeeting(u, m);
    }

    @PostMapping("/cancelMeeting/{userId}")
    public void cancelMeeting(@RequestBody Meeting meet, @PathVariable long userId) throws Exception {

        User u = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("User not found for this id :: " + userId));

        long meetingId = meet.getMeetingId();
        Meeting m = meetingService.getMeetingById(meetingId)
                .orElseThrow(() -> new Exception("Meeting not found for this id :: " + meetingId));

        participantMeetingService.cancelMeeting(u, m);
    }

    @PostMapping("/deleteMeeting")
    public void arrangeMeeting(@RequestBody Meeting meet) throws Exception {

        long meetingId = meet.getMeetingId();

        Meeting m = meetingService.getMeetingById(meetingId)
                .orElseThrow(() -> new Exception("Meeting not found for this id :: " + meetingId));

        meetingService.deleteMeeting(m.getMeetingId());
    }

    //Modifier heure meeting
    @PostMapping("/updateMeeting")
    public void updateMeeting(@RequestBody Meeting meet) throws Exception {

        long meetingId = meet.getMeetingId();
        Meeting m = meetingService.getMeetingById(meetingId)
                .orElseThrow(() -> new Exception("Meeting not found for this id :: " + meetingId));

        meetingService.updateMeeting(meet);
    }

}
