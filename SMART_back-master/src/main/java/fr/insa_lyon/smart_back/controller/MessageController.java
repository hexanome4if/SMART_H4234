package fr.insa_lyon.smart_back.controller;

import fr.insa_lyon.smart_back.model.Message;
import fr.insa_lyon.smart_back.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/message/{messageId}")
    public Message findMessageById (@PathVariable long messageId) throws Exception {
        return messageService.getMessageById(messageId)
                .orElseThrow(() -> new Exception("Unknown message : " + messageId));
    }

    @DeleteMapping("/message/{messageId}")
    public Map< String, Boolean > deleteMessage(@PathVariable(value = "messageId") long messageId)
            throws Exception {
        Message message = messageService.getMessageById(messageId)
                .orElseThrow(() -> new Exception("Message not found for this id :: " + messageId));

        messageService.deleteMessage(messageId);
        Map < String, Boolean > response = new HashMap< >();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

}
