package fr.insa_lyon.smart_back.repository;

import fr.insa_lyon.smart_back.model.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Date;


@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    @Transactional
    @Modifying
    @Query("UPDATE Meeting m SET m.date = ?2 WHERE m.meetingId = ?1" )
    void updateMeeting(long meetingId, Date d);
}
