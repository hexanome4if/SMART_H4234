package fr.insa_lyon.smart_back.service;

import fr.insa_lyon.smart_back.model.Participant;
import fr.insa_lyon.smart_back.repository.ParticipantRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Data
@Service
public class ParticipantService {

    @Autowired // C'est Spring qui va s'occuper de l'instentiation
    private ParticipantRepository participantRepository;

    public Optional<Participant> getParticipantById (final long id) {
        return participantRepository.findById(id);
    }

    public Participant saveParticipant(Participant p) {
        Participant savedParticipant = participantRepository.save(p);
        return savedParticipant;
    }

    public List<Participant> listeParticipant(Long id){
        return participantRepository.getParticipantByChatId(id);
    }

    public List<Participant> getParticipantsByUserIdTrue (final long id){
        return participantRepository.getParticipantByUserIdTrue(id);
    }

    public List<Participant> getParticipantsByUserIdFalse (final long id){
        return participantRepository.getParticipantByUserIdFalse(id);
    }

    public List <Participant> getParticipantByChatId (final long id){
        return participantRepository.getParticipantByChatId(id);
    }

    public List<Participant> getParticipantsByUserIdAccepted (final long id){
        return participantRepository.getParticipantByUserIdAccepted(id);
    }

    public List<Long> getUserAcceptedByChatIdExceptOneUser (final long chatId, final long userId){
        return participantRepository.getUserAcceptedByChatIdExceptOneUser(chatId, userId);
    }

    public void deleteParticipantByChatId(final long chatId) {
        participantRepository.deletePartiipantByChatId(chatId);
    }

    public void deleteParticipant(final long chatId, final long userId) {
        participantRepository.deleteParticipant(chatId, userId);
    }

}
