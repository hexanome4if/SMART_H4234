package fr.insa_lyon.smart_back.service;

import fr.insa_lyon.smart_back.model.*;
import fr.insa_lyon.smart_back.repository.EducationRepository;
import fr.insa_lyon.smart_back.repository.ExperienceRepository;
import fr.insa_lyon.smart_back.repository.TagRepository;
import fr.insa_lyon.smart_back.repository.UserRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Data
@Service
public class UserService { //Exécuter les traitements métiers

    @Autowired // C'est Spring qui va s'occuper de l'instentiation
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private EducationRepository educationRepository;
    @Autowired
    private ExperienceRepository experienceRepository;
    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private AvatarService avatarService;

    public Optional<User> getUserById(final long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUserName(final String userName) {
        return userRepository.findByUserName(userName);
    }

    public Iterable<User> getUsers() {
        return userRepository.findAll();
    }

    public Avatar getUserAvatar(long id) {
        return userRepository.getAvatar(id);
    }

    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword())); //ENCODE PASSWORD
        User savedUser = userRepository.save(user);
        this.setRandomAvatar(savedUser);
        return savedUser;
    }

    public String setRandomAvatar(User user){
        Avatar newAvatar = avatarService.randomAvatar();
        userRepository.setAvatar(user.getUserId(), newAvatar.getAvatarId(), newAvatar);

        return newAvatar.getPhoto();
    }

    public User updateUserWithoutPassword(User user) {
        User savedUser = userRepository.save(user);
        return savedUser;
    }

    public User logUser(String username, String password) throws Exception { //PAS UTILISE AVEC LES JWT
        if(username == null || password == null) {
            throw new Exception("username or password null");
        }
        User user = getUserByUserName(username)
                .orElseThrow(() -> new Exception("User not found for this username :: " + username));
        if(passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    public void deleteUser(final long id) {
        userRepository.deleteById(id);
    }

    public List<String> listeMail(){
        return userRepository.getListMail();
    }

    public List<String> listeUserName(){
        return userRepository.getListUserName();
    }

    public Iterable<Tag> getAbilityTagByUserId(final long id) {
        return  tagRepository.getAbilityTagById(id);
    }

    public Iterable<Tag> getUserInterestsTagByUserId(final long id) {
        return  tagRepository.getUserInterestsTagById(id);
    }

    public Iterable<Experience> getExperiencesByUserId(final long id) {
        return  experienceRepository.findByUserId(id);
    }

    public Iterable<Education> getEducationsByUserId(final long id) {
        return  educationRepository.findByUserId(id);
    }
    

    public Optional<Tag> updateInterestsTag(final String label, final long userId) {
        Iterable<Tag> tags = tagRepository.getUserInterestsTagById(userId);
        for(Tag t : tags) {
            if(t.getLabel().equals(label)) {
                //tag deja existe
                return Optional.empty();
            }
        }
        if(tagRepository.findTagByLabel(label).isEmpty()) {
            Tag tag = new Tag(label);
            tagRepository.save(tag);
        }
        Optional<Tag> tag = Optional.ofNullable(tagRepository.findTagByLabel(label).get(0));
        tagRepository.insertInterestsTag(userId, tag.get().getTagId());
        return tag;
    }

    public void deleteInterestsTag(final long tagId, final long userId) {
        tagRepository.deleteInterestsTag(userId, tagId);
    }

    public Optional<Tag> updateAbilityTag(final String label, final long userId) {
        Iterable<Tag> tags = tagRepository.getAbilityTagById(userId);
        for(Tag t : tags) {
            if(t.getLabel().equals(label)) {
                return Optional.empty();
            }
        }
        if(tagRepository.findTagByLabel(label).isEmpty()) {
            Tag tag = new Tag(label);
            tagRepository.save(tag);
        }
        Optional<Tag> tag = Optional.ofNullable(tagRepository.findTagByLabel(label).get(0));
        tagRepository.insertAbilityTag(userId, tag.get().getTagId());
        return tag;
    }

    public void deleteAbilityTag(final long tagId, final long userId) {
        tagRepository.deleteAbilityTag(userId, tagId);
    }

}
