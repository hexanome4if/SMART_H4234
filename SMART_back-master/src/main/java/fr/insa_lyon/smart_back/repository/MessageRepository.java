package fr.insa_lyon.smart_back.repository;

import fr.insa_lyon.smart_back.model.Message;
import fr.insa_lyon.smart_back.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE m.messageId = ?1")
    Optional<Message> findById(long messageId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Message m WHERE  m.chatId=?1")
    void deleteMessageByChatId(long chatId);

    @Query("SELECT m FROM Message m WHERE m.userId = ?1")
    List<Message> findByUserId(long userId);

    @Query("SELECT m FROM Message m WHERE m.chatId = ?1")
    List<Message> findByChatId(long chatId);

    @Query(value = "SELECT m.* FROM MESSAGE m WHERE m.chat_id = ?1 ORDER BY msg_date DESC LIMIT 0,1", nativeQuery = true)
    Optional<Message> findLastMessage(long id);

}
