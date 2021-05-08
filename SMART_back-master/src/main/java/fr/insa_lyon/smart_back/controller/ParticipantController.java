package fr.insa_lyon.smart_back.controller;

import fr.insa_lyon.smart_back.model.Chat;
import fr.insa_lyon.smart_back.model.Message;
import fr.insa_lyon.smart_back.model.Participant;
import fr.insa_lyon.smart_back.model.User;
import fr.insa_lyon.smart_back.service.ChatService;
import fr.insa_lyon.smart_back.service.MessageService;
import fr.insa_lyon.smart_back.service.ParticipantService;
import fr.insa_lyon.smart_back.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

@RestController
public class ParticipantController {

    @Autowired
    private ParticipantService participantService;
    @Autowired
    private ChatService chatService;
    @Autowired
    private UserService userService;
    @Autowired
    private MessageService messageService;

    @GetMapping("/participants/user/{userId}")
    public ResponseEntity<List<User>> getParticipantsByUserId(@PathVariable(value = "userId") Long userId) {
        List<Participant> participants = participantService.getParticipantsByUserIdAccepted(userId);
        List<Long> chatIds = new ArrayList<>();
        participants.forEach(participant -> chatIds.add(participant.getChatId()));
        List<Long> userIds = new ArrayList<>();
        for (Long id: chatIds) {
            userIds.addAll(participantService.getUserAcceptedByChatIdExceptOneUser(id, userId));
        }
        userIds = userIds.stream().distinct().collect(Collectors.toList()); //supprimer les doublons
        List<User> users = new ArrayList<>();
        userIds.forEach(id -> users.add(userService.getUserById(id).get())); //Liste de Users

        return ResponseEntity.ok().body(users);
    }

    @PostMapping("/participant/associerListeParticipants")
    public ResponseEntity<Participant> associerListeParticipants (@Valid @RequestBody Participant participant)
            throws Exception {
        Chat chat = chatService.getChatById(participant.getChatId())
                .orElseThrow(() -> new Exception("Chat not found for this id :: " + participant.getChatId()));
        User user = userService.getUserById(participant.getUserId())
                .orElseThrow(() -> new Exception("User not found for this id :: " + participant.getUserId()));
        final Participant updatedParticipant = participantService.saveParticipant(participant);
        return ResponseEntity.ok(updatedParticipant);
    }

    @PutMapping("/participant/accepterChat/{participantId}")
    public ResponseEntity<Participant> accepterChat (@PathVariable(value = "participantId") long participantId)
            throws Exception {
        Participant p = participantService.getParticipantById(participantId).get();
        Chat chat = chatService.getChatById(p.getChatId())
                .orElseThrow(() -> new Exception("Chat not found for this id :: " + p.getChatId()));
        User user = userService.getUserById(p.getUserId())
                .orElseThrow(() -> new Exception("User not found for this id :: " + p.getUserId()));
        p.setAccepted(true);
        final Participant updatedParticipant = participantService.saveParticipant(p);
        return ResponseEntity.ok(updatedParticipant);
    }

    @PutMapping("/participant/refuserChat/{participantId}")
    public void refuserChat (@PathVariable(value = "participantId") long participantId)
            throws Exception {
        Participant p = participantService.getParticipantById(participantId).get();
        Chat chat = chatService.getChatById(p.getChatId())
                .orElseThrow(() -> new Exception("Chat not found for this id :: " + p.getChatId()));
        User user = userService.getUserById(p.getUserId())
                .orElseThrow(() -> new Exception("User not found for this id :: " + p.getUserId()));
        p.setAccepted(false);
        participantService.deleteParticipant(p.getChatId(), p.getUserId());
        return ;
    }

    @PutMapping("/participant/ouvrirConv/{participantId}")
    public ResponseEntity <List<User>> ouvrirConv (@PathVariable(value = "participantId") long participantId)
            throws Exception {
        Participant p = participantService.getParticipantById(participantId).get();
        Timestamp now = Timestamp.from(Instant.now());
        p.setLastOpen(now);
        participantService.saveParticipant(p);
        Chat chat = chatService.getChatById(p.getChatId())
                .orElseThrow(() -> new Exception("Chat not found for this id :: " + p.getChatId()));
        User user = userService.getUserById(p.getUserId())
                .orElseThrow(() -> new Exception("User not found for this id :: " + p.getUserId()));
        List <Participant> listeP = participantService.getParticipantByChatId(p.getChatId());
        List <User> res = new ArrayList<>();
        for (int i=0; i<listeP.size(); i++){
            Long l = listeP.get(i).getUserId();
            User u = userService.getUserById(l).get();
            res.add(u);
        }
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/participant/getMessages/{participantId}")
    public ResponseEntity <List<Message>> getMessages (@PathVariable(value = "participantId") long participantId)
            throws Exception {
        Participant p = participantService.getParticipantById(participantId).get();
        Chat chat = chatService.getChatById(p.getChatId())
                .orElseThrow(() -> new Exception("Chat not found for this id :: " + p.getChatId()));
        User user = userService.getUserById(p.getUserId())
                .orElseThrow(() -> new Exception("User not found for this id :: " + p.getUserId()));
        List <Message> res = messageService.findMessageByChatId(p.getChatId());//findMessageByUserId(p.getUserId());
        return ResponseEntity.ok().body(res);
    }

}
