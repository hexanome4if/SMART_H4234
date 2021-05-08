package fr.insa_lyon.smart_back.service;

import fr.insa_lyon.smart_back.model.Chat;
import fr.insa_lyon.smart_back.repository.ChatRepository;
import fr.insa_lyon.smart_back.repository.ParticipantRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Data
@Service
public class ChatService {

    @Autowired // C'est Spring qui va s'occuper de l'instentiation
    private ChatRepository chatRepository;
    private ParticipantRepository participantRepository;

    public Optional<Chat> getChatById (final long id){
        System.out.println("--id--" + id);return chatRepository.findById(id);
    }

    public Chat getChatIdsWhereOtherUserAccepted (final long chatId, final long userId){
        int verif = chatRepository.getChatIdWhereOtherUserAccepted(chatId, userId);
        if(verif>0) {
            return getChatById(chatId).get();
        }
        return null;
    }

    public void deleteChat(final long id) {
        chatRepository.deleteById(id);
    }

    public Chat saveChat(Chat chat) {
        Chat savedChat = chatRepository.save(chat);
        return savedChat;
    }





}
