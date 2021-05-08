package fr.insa_lyon.smart_back.repository;

import fr.insa_lyon.smart_back.model.Chat;
import fr.insa_lyon.smart_back.model.Participant;
import fr.insa_lyon.smart_back.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    @Query("SELECT COUNT(p) FROM Participant p WHERE p.chatId = ?1 and p.userId<>?2 and p.accepted=true")
    int getChatIdWhereOtherUserAccepted (long chatId, long userId);
}
