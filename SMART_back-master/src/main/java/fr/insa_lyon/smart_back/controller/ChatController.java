package fr.insa_lyon.smart_back.controller;

import fr.insa_lyon.smart_back.message.Notif;
import fr.insa_lyon.smart_back.model.*;
import fr.insa_lyon.smart_back.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

@CrossOrigin(origins = "*")
@Controller
public class ChatController {

    @Autowired
    private ChatService chatService;
    @Autowired
    private MessageService messageService;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private UserService userService;
    @Autowired
    private ParticipantService participantService;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private NotifService notifService;


    @GetMapping("/chat/{chatId}")
    public ResponseEntity <Chat> findChatById ( @PathVariable(value = "chatId") long chatId) throws Exception {
        System.out.println("chatid" + chatId);
        Chat chat = chatService.getChatById(chatId)
                .orElseThrow(() -> new Exception("Unknown chat : " + chatId));
        System.out.println("chat" + chat);
        return ResponseEntity.ok().body(chat);
    }

    @GetMapping("/chat/byUser/{userId}")
    public ResponseEntity < List<Chat>> findChatByUserId ( @PathVariable(value = "userId") long userId) throws Exception {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("User not found for this id :: " + userId));
        List<Participant> p = participantService.getParticipantsByUserIdTrue(userId);
        List<Chat> res = new ArrayList<>();
        for (int i=0; i<p.size();i++){
            Chat chat = chatService.getChatIdsWhereOtherUserAccepted(p.get(i).getChatId(), userId);
            if(chat != null) {
                res.add(chat);
            }
        }
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/chat/demande/{userId}")
    public ResponseEntity < List<Chat>> demande ( @PathVariable(value = "userId") long userId) throws Exception {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("User not found for this id :: " + userId));
        List<Participant> p = participantService.getParticipantsByUserIdFalse(userId);
        List<Chat>res = new ArrayList<>();
        for (int i=0; i<p.size();i++){
            Optional <Chat> c = chatService.getChatById(p.get(i).getChatId());
            res.add(c.get());
        }
        return ResponseEntity.ok().body(res);
    }

    @PostMapping("/chat")
    public ResponseEntity <Chat> createChat(@Valid @RequestBody Chat chat) {
        return ResponseEntity.ok().body(chatService.saveChat(chat));
    }

    @PutMapping("/chat/{chatId}")
    public ResponseEntity< Chat > updateChat(@PathVariable(value = "chatId") long chatId,
                                             @Valid @RequestBody Chat chatDetails) throws Exception {
        Chat chat = chatService.getChatById(chatId)
                .orElseThrow(() -> new Exception("Chat not found for this id :: " + chatId));

        chat.setLabel(chatDetails.getLabel());
        chat.setLastMessageDate(chatDetails.getLastMessageDate());
        final Chat updatedChat = chatService.saveChat(chat);
        return ResponseEntity.ok(updatedChat);
    }

    @DeleteMapping("/chat/{chatId}")
    public ResponseEntity <Map< String, Boolean >> deleteChat(@PathVariable(value = "chatId") long chatId) throws Exception {
        Chat chat = chatService.getChatById(chatId)
                .orElseThrow(() -> new Exception("Chat not found for this id :: " + chatId));
        messageService.deleteMessageByChatId(chatId);
        participantService.deleteParticipantByChatId(chatId);
        chatService.deleteChat(chatId);
        Map < String, Boolean > response = new HashMap< >();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok().body(response);
    }

    //https://www.baeldung.com/websockets-spring
    @MessageMapping("/chat/{chatId}")
    public void send(@Payload MessageDTO message, Principal principal, @DestinationVariable("chatId") long chatId) throws Exception {
        User user = userService.getUserByUserName(principal.getName())
                .orElseThrow(() -> new Exception("User not found for this name :: " + principal.getName()));
        Timestamp now = Timestamp.from(Instant.now());
        Chat chat = chatService.getChatById(chatId).get();
        chat.setLastMessageDate(now);
        notificationService.setFlagWithoutSender(chatId,user.getUserId());
        final Chat updatedChat = chatService.saveChat(chat);
        Message m = new Message(message, user.getUserId(), chatId, now);
        final Message sendMessage = messageService.saveMessage(m);
        List<Participant> participants = participantService.getParticipantByChatId(chatId);
        for (Participant p: participants) {
            if(p.getUserId() == user.getUserId()) {
                p.setLastOpen(now);
                participantService.saveParticipant(p);
            }
            if(p.getAccepted()) {
                String name = userService.getUserById(p.getUserId()).get().getUserName();
                simpMessagingTemplate.convertAndSendToUser(name, "/queue/chat/message", sendMessage);
                if(p.getUserId() != user.getUserId()) {
                    notifService.sendPushNotification(userService.getUserById(p.getUserId()).get(), "Nouveau message", "Message de : '" + principal.getName() +  "'");
                }
            }
        }
    }

    //https://www.baeldung.com/spring-websockets-send-message-to-user
    /*@MessageMapping("/chat/send")
    public void sendSpecific(
            @Payload MessageDTO msg,
            Principal user,
            @Header("simpSessionId") String sessionId) throws Exception {
        System.out.println("sending msg");
        Message out = new Message(
                msg.getType(),
                msg.getContent(),
                Timestamp.from(Instant.now()));
        Optional<Chat> chat = chatService.getChatById(msg.getChatId());
        if (chat.isEmpty()) { return; }
        System.out.println("chat ok");
        out.setChatId(msg.getChatId());
        Optional <User> u = userService.getUserById(1);
        if (u.isEmpty()) { return;}
        System.out.println("user ok");
        out.setUserId(u.get().getUserId());
        messageService.saveMessage(out);
        notificationService.setFlagWithoutSender(out.getChatId(), out.getUserId());
        List <Participant> p = participantService.listeParticipant(chat.get().getChatId());
        for (int i=0; i<p.size(); i++){
            simpMessagingTemplate.convertAndSendToUser(
                    userService.getUserById(p.get(i).getUserId()).get().getUserName(), "/user/queue/specific-user", out);
        }
    }*/

    @PostMapping("/chat/addUserChat")
    public ResponseEntity <Participant> addUserChat (@RequestBody Participant participant)
            throws Exception {
        Chat chat = chatService.getChatById(participant.getChatId())
                .orElseThrow(() -> new Exception("Chat not found for this id :: " + participant.getChatId()));
        User user = userService.getUserById(participant.getUserId())
                .orElseThrow(() -> new Exception("User not found for this id :: " + participant.getUserId()));
        final Participant res = participantService.saveParticipant(participant);
        notifService.sendNotification(user, new Notif("Nouvelle demande de chat", "info", 5, false, "Ouvrir", "/chat"));
        notifService.sendPushNotification(user, "Nouvelle demande de chat", "Vous avez été invité à rejoindre le chat: '" + chat.getLabel() +  "'");
        return ResponseEntity.ok().body(res);
    }

    @DeleteMapping("/chat/{chatId}/{userId}")
    public ResponseEntity <Map < String, Boolean >> supUserChat (@PathVariable(value = "chatId") long chatId, @PathVariable(value = "userId") long userId)
            throws Exception {
        Chat chat = chatService.getChatById(chatId)
                .orElseThrow(() -> new Exception("Chat not found for this id :: " + chatId));
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("User not found for this id :: " + userId));
        participantService.deleteParticipant(chatId, userId);
        Map < String, Boolean > response = new HashMap< >();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok().body(response);
    }

}




