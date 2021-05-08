package fr.insa_lyon.smart_back.repository;

import fr.insa_lyon.smart_back.model.Meeting;
import fr.insa_lyon.smart_back.model.ParticipantMeeting;
import fr.insa_lyon.smart_back.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantMeetingRepository extends JpaRepository<ParticipantMeeting, Long> {

    @Query("SELECT pm.meeting FROM ParticipantMeeting pm WHERE pm.user = ?1" +
            " AND pm.accepted = false AND pm.cancelled = false AND pm.initiator = false")
    List<Meeting> getListReceivedMeeting(User u);

    @Query("SELECT pm.meeting FROM ParticipantMeeting pm WHERE pm.user = ?1" +
            " AND pm.accepted = false AND pm.cancelled = false AND pm.initiator = true")
    List<Meeting> getListSentMeeting(User u);

    @Query("SELECT pm.meeting FROM ParticipantMeeting pm WHERE pm.user = ?1" +
            " AND pm.accepted = true AND pm.cancelled = false")
    List<Meeting> getListPlannedMeeting(User u);

    @Query("SELECT pm.meeting FROM ParticipantMeeting pm WHERE pm.user = ?1" +
            " AND pm.accepted = true AND pm.cancelled = true")
    List<Meeting> getListCancelledMeeting(User u);

    /*
    @Query("SELECT pm.meeting FROM ParticipantMeeting pm WHERE pm.user = ?1" +
            " AND pm.accepted = true")
    List<Meeting> getListAcceptedMeeting(User u);

    @Query("SELECT pm.meeting FROM ParticipantMeeting pm WHERE pm.user = ?1" +
            " AND pm.accepted = false")
    List<Meeting> getListNotAcceptedMeeting(User u);
    */

    @Query(value = "SELECT COUNT(*) FROM ParticipantMeeting WHERE meeting_id = :meetId", nativeQuery = true)
    long countMeetingParticipants(@Param("meetId") long meetId);

    @Transactional
    @Modifying
    @Query("DELETE FROM ParticipantMeeting pm WHERE pm.user = ?1" +
            " AND pm.meeting = ?2")
    void deleteParticipantMeetingByFKs(User u, Meeting m);

    @Transactional
    @Modifying
    @Query("UPDATE ParticipantMeeting pm SET pm.accepted = true WHERE pm.user = ?1" +
            " AND pm.meeting = ?2")
    void acceptMeeting(User u, Meeting m);

    @Transactional
    @Modifying
    @Query("UPDATE ParticipantMeeting pm SET pm.accepted = true WHERE pm.meeting = ?1" +
            " AND pm.initiator = true")
    void acceptMeetingToInitiator(Meeting m);

    @Transactional
    @Modifying
    @Query("UPDATE ParticipantMeeting pm SET pm.cancelled = true WHERE pm.meeting = ?1")
    void cancelParticipantMeeting(Meeting m);

}
