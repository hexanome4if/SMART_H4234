package fr.insa_lyon.smart_back.service;


import fr.insa_lyon.smart_back.model.Meeting;
import fr.insa_lyon.smart_back.model.ParticipantMeeting;
import fr.insa_lyon.smart_back.model.User;
import fr.insa_lyon.smart_back.repository.MeetingRepository;
import fr.insa_lyon.smart_back.repository.ParticipantMeetingRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Data
@Service
public class ParticipantMeetingService {

    @Autowired
    private ParticipantMeetingRepository participantMeetingRepository;

    @Autowired
    private MeetingService meetingService;

    public Optional<ParticipantMeeting> getParticipantMeetingById(final long id) {
        return participantMeetingRepository.findById(id);
    }

    public ParticipantMeeting saveParticipantMeeting(ParticipantMeeting pm) {
        ParticipantMeeting savedParticipantMeeting = participantMeetingRepository.save(pm);
        return savedParticipantMeeting;
    }

    public Iterable<Meeting> listReceivedMeeting(User user){
        return participantMeetingRepository.getListReceivedMeeting(user);
    }

    public Iterable<Meeting> listSentMeeting(User user){
        return participantMeetingRepository.getListSentMeeting(user);
    }

    public Iterable<Meeting> listPlannedMeeting(User user){
        return participantMeetingRepository.getListPlannedMeeting(user);
    }
    public Iterable<Meeting> listCancelledMeeting(User user){
        return participantMeetingRepository.getListCancelledMeeting(user);
    }

    /*
    public Iterable<Meeting> listAcceptedMeeting(User user){
        return participantMeetingRepository.getListAcceptedMeeting(user);
    }

    public Iterable<Meeting> listNotAcceptedMeeting(User user){
        return participantMeetingRepository.getListNotAcceptedMeeting(user);
    }
    */

    public void acceptMeeting(User u, Meeting m){
        participantMeetingRepository.acceptMeeting(u, m);
        participantMeetingRepository.acceptMeetingToInitiator(m);
    }

    public void refuseMeeting(User u, Meeting m){

        if( participantMeetingRepository.countMeetingParticipants(m.getMeetingId()) > 2)
            participantMeetingRepository.deleteParticipantMeetingByFKs(u, m);
        else
            meetingService.deleteMeeting(m.getMeetingId());
    }

    public void cancelMeeting(User u, Meeting m){

        participantMeetingRepository.deleteParticipantMeetingByFKs(u, m);

        if( participantMeetingRepository.countMeetingParticipants(m.getMeetingId()) < 2)
            participantMeetingRepository.cancelParticipantMeeting(m);
    }

    public void deleteParticipantMeeting(final long id) {
        participantMeetingRepository.deleteById(id);
    }

}
