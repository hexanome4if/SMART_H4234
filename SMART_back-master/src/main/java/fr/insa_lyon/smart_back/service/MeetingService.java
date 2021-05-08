package fr.insa_lyon.smart_back.service;

import fr.insa_lyon.smart_back.model.Meeting;
import fr.insa_lyon.smart_back.repository.MeetingRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Data
@Service
public class MeetingService {

    @Autowired // Spring s'occupe de l'instentiation
    private MeetingRepository meetingRepository;

    public Optional<Meeting> getMeetingById(final long id) {
        return meetingRepository.findById(id);
    }

    public Meeting saveMeeting(Meeting meeting){
        Meeting savedMeeting = meetingRepository.save(meeting);
        return savedMeeting;
    }

    public void updateMeeting(Meeting meeting){
        meetingRepository.updateMeeting(meeting.getMeetingId(), meeting.getDate());
    }

    public void deleteMeeting(final long id) {
        meetingRepository.deleteById(id);
    }


}
