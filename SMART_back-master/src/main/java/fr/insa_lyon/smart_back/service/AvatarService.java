package fr.insa_lyon.smart_back.service;

import fr.insa_lyon.smart_back.model.Avatar;
import fr.insa_lyon.smart_back.repository.AvatarRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Data
@Service
public class AvatarService {

    @Autowired // Spring s'occupe de l'instentiation
    private AvatarRepository avatarRepository;

    public Avatar randomAvatar(){
        Random rand = new Random();
        List<Avatar> avatars = avatarRepository.getListAvatar();
        return avatars.get(rand.nextInt(avatars.size()));
    }
}
