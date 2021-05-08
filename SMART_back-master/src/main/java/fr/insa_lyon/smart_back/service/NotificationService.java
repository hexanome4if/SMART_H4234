package fr.insa_lyon.smart_back.service;

import fr.insa_lyon.smart_back.model.*;
import fr.insa_lyon.smart_back.repository.*;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Future;

@Data
@Service
public class NotificationService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ParticipantRepository participantRepository;
    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private MessageRepository messageRepository;

    // Map <chatId, Map<userId, boolean>>
    private Map<Long, Map<Long, Boolean>> chatMap = new HashMap<Long, Map<Long, Boolean>>();

    @Async
    public Future<Message> getMessage(final long userId) throws Exception {
        while (true) {
            synchronized (this) {
                List<Participant> participants = participantRepository.getParticipantByUserIdTrue(userId);
                for (Participant p : participants) {
                    // verify accept status
                    if (!participantRepository.isAccepted(p.getChatId(), userId))
                        continue;
                    // verify new message update & get rid of NullPointerException
                    if (chatMap.containsKey(p.getChatId()) && chatMap.get(p.getChatId()).containsKey(userId)
                            && chatMap.get(p.getChatId()).get(userId)) {
                        chatMap.get(p.getChatId()).put(userId, false);
                        Message resultMsg = messageRepository.findLastMessage(p.getChatId())
                                .orElseThrow(() -> new Exception("Message not found for this id :: " + p.getChatId()));
                        return new AsyncResult(resultMsg);
                    }
                }
            }
            // sync period
            Thread.sleep(100);
        }
    }

    /*
     * set new message flag for a certain chat
     */
    public synchronized void setFlag(Long chatId) throws Exception {
        Map<Long, Boolean> userMap = new HashMap<>();
        List<Participant> participants = participantRepository.getParticipantByChatId(chatId);
        for (Participant p : participants) {
            userMap.put(p.getUserId(),true);
        }
        chatMap.put(chatId, userMap);
    }

    /*
     * set new message flag for a certain chat except the message sender
     */
    public synchronized void setFlagWithoutSender(Long chatId, Long userId) throws Exception {
        Map<Long, Boolean> userMap = new HashMap<>();
        List<Participant> participants = participantRepository.getParticipantByChatId(chatId);
        for (Participant p : participants) {
            if(p.getUserId() != userId)
                userMap.put(p.getUserId(),true);
        }
        chatMap.put(chatId, userMap);
    }

    /*
    public Optional<Message> newMessageReceived(final long userId) {
        List<Participant> participants = participantRepository.getParticipantByUserId(userId);
        for (Participant p : participants) {
            if (p.getChat().getLastMessageDate().getTime() > p.getLastOpen().getTime()) {
                return messageRepository.findLastMessage(p.getChatId());
            }
        }
        return Optional.empty();
    }
    */

}