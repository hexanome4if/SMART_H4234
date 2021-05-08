package fr.insa_lyon.smart_back.service;

import fr.insa_lyon.smart_back.model.Message;
import fr.insa_lyon.smart_back.repository.MessageRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Data
@Service
public class MessageService {

    @Autowired // C'est Spring qui va s'occuper de l'instentiation
    private MessageRepository messageRepository;

    public Optional<Message> getMessageById (final long id){
        return messageRepository.findById(id);
    }

    public List<Message> findMessageByUserId (final long id) {return messageRepository.findByUserId(id);}

    public List<Message> findMessageByChatId (final long id) {return messageRepository.findByChatId(id);}

    public void deleteMessage(final long id) {
        messageRepository.deleteById(id);
    }

    public Message saveMessage (Message message) {
        Message savedMessage = messageRepository.save(message);
        return savedMessage;
    }

    public void deleteMessageByChatId(final long chatId) {
        messageRepository.deleteMessageByChatId(chatId);
    }

    //*****


}
