package fr.insa_lyon.smart_back.repository;

import fr.insa_lyon.smart_back.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {

    @Query("SELECT p FROM Participant p WHERE p.userId = ?1 and p.accepted=true")
    List<Participant> getParticipantByUserIdTrue (long id);

    @Query("SELECT p FROM Participant p WHERE p.userId = ?1 and p.accepted=false")
    List<Participant> getParticipantByUserIdFalse (long id);

    @Query("SELECT p FROM Participant p WHERE p.userId = ?1 and p.accepted=true")
    List<Participant> getParticipantByUserIdAccepted (long id);

    @Query("SELECT p FROM Participant p WHERE p.chatId = ?1")
    List<Participant> getParticipantByChatId (long id);

    @Query("SELECT p.userId FROM Participant p WHERE p.chatId = ?1 and p.userId <> ?2 and p.accepted=true")
    List<Long> getUserAcceptedByChatIdExceptOneUser (long chatId, long userId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Participant p WHERE  p.chatId=?1")
    void deletePartiipantByChatId(long chatId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Participant p WHERE  p.chatId=?1 and p.userId = ?2")
    void deleteParticipant(long chatId, long userId);

    @Query(value = "SELECT p.accepted FROM Participant p WHERE p.chat_id = ?1 AND p.user_id = ?2", nativeQuery = true)
    Boolean isAccepted(long chatId, long userId);

}
