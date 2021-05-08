package fr.insa_lyon.smart_back.service;

import com.google.gson.Gson;
import fr.insa_lyon.smart_back.message.Notif;
import fr.insa_lyon.smart_back.model.User;
import io.github.jav.exposerversdk.ExpoPushMessage;
import io.github.jav.exposerversdk.PushClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class NotifService {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    public void sendNotification(User user, Notif notification) {
        // Send it over websocket
        System.out.println("Send notif to " + user.getUserName());
        simpMessagingTemplate.convertAndSendToUser(
                user.getUserName(),
                "/queue/notif",
                (new Gson()).toJson(notification)
        );


    }

    public void sendPushNotification(User user, String title, String body) {
        // Push notification
        if(user.getDevice() == null ) {
            return;
        }
        if (!PushClient.isExponentPushToken(user.getDevice())) return;

        ExpoPushMessage expoPushMessage = new ExpoPushMessage();
        expoPushMessage.getTo().add(user.getDevice());
        expoPushMessage.setTitle(title);
        expoPushMessage.setBody(body);
        try {
            PushClient client = new PushClient();
            client.sendPushNotificationsAsync(Arrays.asList(expoPushMessage));
        } catch (Exception e) {
            System.out.println(e);
        }
    }

}
