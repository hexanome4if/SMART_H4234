package fr.insa_lyon.smart_back.controller;

import fr.insa_lyon.smart_back.model.Message;
import fr.insa_lyon.smart_back.model.Notification;
import fr.insa_lyon.smart_back.model.User;
import fr.insa_lyon.smart_back.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

@RestController
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/wait/{userId}")
    public Notification waitNotification(@PathVariable(value = "userId") long userId) throws Exception {

        Future<Message> result = null;
        Message message = null;

        try {
            // fetch new message
            result = notificationService.getMessage(userId);
            // set timeout for 10s
            message = result.get(10, TimeUnit.SECONDS);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (result != null){
                result.cancel(true);
            }
        }
        if (message != null) {
            return new Notification(message.getUserId(), message.getType(), message.getContent());
        } else {
            return new Notification(-1L,null,null);
        }
    }

    // !! for tests only !!
    @PostMapping("/send")
    public void post() throws Exception {
        notificationService.setFlag(1L);
        notificationService.setFlag(2L);
        notificationService.setFlag(3L);
    }

}

