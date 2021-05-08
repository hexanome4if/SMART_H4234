package fr.insa_lyon.smart_back.controller;

import fr.insa_lyon.smart_back.model.*;
import fr.insa_lyon.smart_back.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

@RestController
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private EducationService educationService;
    @Autowired
    private ExperienceService experienceService;
    @Autowired
    private FAQService faqService;

    /*static String sha1(String input) throws NoSuchAlgorithmException {
        MessageDigest mDigest = MessageDigest.getInstance("SHA1");
        byte[] result = mDigest.digest(input.getBytes());
        StringBuffer sb = new StringBuffer();
        for (byte b : result) {
            sb.append(Integer.toString((b & 0xff) + 0x100, 16).substring(1));
        }

        return sb.toString();
    }*/

    @GetMapping("/user/{userName}") // TODO : regénérer token et renvoyer token
    public User getUserByUsername(@PathVariable(value = "userName") String userName) throws Exception{
        return userService.getUserByUserName(userName)
                .orElseThrow(() -> new Exception("Unknown user : " + userName));
    }

    @GetMapping("/avatar/{userId}")
    public String getUserAvatar(@PathVariable(value = "userId") long userId) throws Exception{
        User u = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("Unknown user : " + userId));

        Avatar a = userService.getUserAvatar(userId);
        return a.getPhoto();
    }

    @GetMapping("/getRandomAvatar/{userId}")
    public String setRandomAvatar(@PathVariable(value = "userId") long userId) throws Exception{
        User u = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("Unknown user : " + userId));

        return userService.setRandomAvatar(u);
    }

    @PostMapping("/login") //PAS UTILISE AVEC LES JWT
    public User login(@RequestBody User userBody) throws Exception {
        System.out.println("Login");
        String username = userBody.getUserName();
        String password = userBody.getPassword();
        User user = userService.logUser(username, password);
        System.out.println("Login ! token " + userBody.getDevice());
        user.setDevice(userBody.getDevice());
        userService.saveUser(user);
        return user;
    }

    @PostMapping("/user/device/{userName}") //PAS UTILISE AVEC LES JWT
    public Boolean setDevice(@RequestBody User userBody, @PathVariable(value = "userName") String userName) throws Exception {
        User user = userService.getUserByUserName(userName)
                .orElseThrow(() -> new Exception("Unknown user : " + userName));
        user.setDevice(userBody.getDevice());
        userService.saveUser(user);
        return true;
    }

    @PostMapping("/inscription")
    public Map< String, Boolean > inscription(@RequestBody User userBody) {
        System.out.println("Inscription");
        List<String> mails = userService.listeMail();
        List<String> users = userService.listeUserName();
        Map < String, Boolean > response = new HashMap< >();
        if(mails.contains(userBody.getMail())){
            response.put("mail already exists", Boolean.FALSE);
            return response;
        }
        if(users.contains(userBody.getUserName())){
            response.put("username already exists", Boolean.FALSE);
            return response;
        }
        if(userBody.getUserName().contains("/")){
            response.put("username cannot contains '/'", Boolean.FALSE);
            return response;
        }
        userService.saveUser(userBody);
        response.put("inscription", Boolean.TRUE);
        return response;
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<ProfileDTO> getProfile(@PathVariable(value = "id") Long userId) throws Exception {
        //si on veut consulter son propre profil
        /*if(userId.equals(String.valueOf(userBody.getUserId()))) {

        }*/
        //Long id = Long.parseLong(userId);
        long id=userId;
        Iterable<Tag> abilityTags = userService.getAbilityTagByUserId(id);
        Iterable<Tag> interestsTags = userService.getUserInterestsTagByUserId(id);
        Iterable<Experience> experiences = userService.getExperiencesByUserId(id);
        Iterable<Education> educations = userService.getEducationsByUserId(id);

        User user = userService.getUserById(id).orElseThrow(() -> new Exception("Unknown user : " + userId));
        user.setUserAbilityTags((List<Tag>)abilityTags);
        user.setUserInterestTags((List<Tag>)interestsTags);
        user.setExperiences((List<Experience>)experiences);
        user.setEducations((List<Education>)educations);

        Iterable<QuestionAnswer> questions = faqService.getQuestionsWithoutUserDetails(id);
        ProfileDTO profile = new ProfileDTO(user);

        profile.setFaqs(questions);

        return ResponseEntity.ok().body(profile);
    }

    @GetMapping("/profile/username/{username}")
    public Map<Boolean, User> searchProfileByUserName(@PathVariable(value = "username") String userName) throws Exception {
        Map<Boolean, User> result = new HashMap<>();
        User u = userService.getUserByUserName(userName).orElse(null);
        if(u == null) {
            result.put(false, null);
            return result;
        }
        long id=u.getUserId();
        Iterable<Tag> abilityTags = userService.getAbilityTagByUserId(id);
        Iterable<Tag> interestsTags = userService.getUserInterestsTagByUserId(id);
        Iterable<Experience> experiences = userService.getExperiencesByUserId(id);
        Iterable<Education> educations = userService.getEducationsByUserId(id);

        User user = userService.getUserById(id).get();
        user.setUserAbilityTags((List<Tag>)abilityTags);
        user.setUserInterestTags((List<Tag>)interestsTags);
        user.setExperiences((List<Experience>)experiences);
        user.setEducations((List<Education>)educations);

        result.put(true, user);

        return result;
    }

    @GetMapping("/profile/education/{instituteId}")
    public Map<Boolean, List<User>> searchProfileByInstituteId(@RequestParam(value = "nb", defaultValue = "0") int nb, @RequestParam(value = "page", defaultValue = "0") int page, @PathVariable(value = "instituteId") String instituteId) throws Exception {
        Map<Boolean, List<User>> result = new HashMap<>();
        List<Long> userIds = educationService.getUserIdsByInstituteId(instituteId);
        if(userIds.isEmpty()) {
            result.put(false, null);
            return result;
        }

        List<User> users = searchUsers(userIds);

        System.out.println(userIds.size());


        if(page != 0 && nb==0) {
            nb=10; // 10 par page par défaut
        }
        if(page!=0 && (page-1)*nb<users.size() && nb>users.size()) {
            int indexEnd = (page-1)*nb+nb;
            if(indexEnd > users.size()) {
                indexEnd = users.size();
            }
            users = users.subList((page-1)*nb,indexEnd);
        }
        if(nb !=0 && nb<users.size()) {
            users = users.subList(0,nb);
        }

        result.put(true, users);

        return result;
    }

    @GetMapping("/profile/education/label/{label}")
    public Map<Boolean, List<User>> searchProfileByLabelEducation(@RequestParam(value = "nb", defaultValue = "0") int nb, @RequestParam(value = "page", defaultValue = "0") int page, @PathVariable(value = "label") String label) throws Exception {
        Map<Boolean, List<User>> result = new HashMap<>();
        List<Long> userIds = educationService.getUserIdsByLabel(label);
        if(userIds.isEmpty()) {
            result.put(false, null);
            return result;
        }

        List<User> users = searchUsers(userIds);

        System.out.println(userIds.size());


        if(page != 0 && nb==0) {
            nb=10; // 10 par page par défaut
        }
        if(page!=0 && (page-1)*nb<users.size() && nb>users.size()) {
            int indexEnd = (page-1)*nb+nb;
            if(indexEnd > users.size()) {
                indexEnd = users.size();
            }
            users = users.subList((page-1)*nb,indexEnd);
        }
        if(nb !=0 && nb<users.size()) {
            users = users.subList(0,nb);
        }
        result.put(true, users);
        return result;
    }

    @GetMapping("/profile/experience/{siret}")
    public Map<Boolean, List<User>> searchProfileBySiret(@RequestParam(value = "nb", defaultValue = "0") int nb, @RequestParam(value = "page", defaultValue = "0") int page, @PathVariable(value = "siret") String siret) throws Exception {
        Map<Boolean, List<User>> result = new HashMap<>();
        List<Long> userIds = experienceService.getUserIdsBySiret(siret);
        if(userIds.isEmpty()) {
            result.put(false, null);
            return result;
        }


        List<User> users = searchUsers(userIds);

        System.out.println(userIds.size());


        if(page != 0 && nb==0) {
            nb=10; // 10 par page par défaut
        }
        if(page!=0 && (page-1)*nb<users.size() && nb>users.size()) {
            int indexEnd = (page-1)*nb+nb;
            if(indexEnd > users.size()) {
                indexEnd = users.size();
            }
            users = users.subList((page-1)*nb,indexEnd);
        }
        if(nb !=0 && nb<users.size()) {
            users = users.subList(0,nb);
        }

        result.put(true, users);

        return result;
    }

    private List<User> searchUsers(List<Long> userIds) {
        List<User> users = new ArrayList<>();
        for (long id: userIds) {
            Iterable<Tag> abilityTags = userService.getAbilityTagByUserId(id);
            Iterable<Tag> interestsTags = userService.getUserInterestsTagByUserId(id);
            Iterable<Experience> experiences = userService.getExperiencesByUserId(id);
            Iterable<Education> educations = userService.getEducationsByUserId(id);

            User user = userService.getUserById(id).get();
            user.setUserAbilityTags((List<Tag>)abilityTags);
            user.setUserInterestTags((List<Tag>)interestsTags);
            user.setExperiences((List<Experience>)experiences);
            user.setEducations((List<Education>)educations);

            users.add(user);
        }
        return users;
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity < User > updateUser(@PathVariable(value = "id") Long userId,
                                              @Valid @RequestBody User userDetails) throws Exception {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("User not found for this id :: " + userId));
        if(userDetails.getUserName().contains("/")){
            throw new Exception("username cannot contains '/'");
        }

        //user.setUserName(userDetails.getUserName());
        //user.setPassword(userDetails.getPassword());

        if(userDetails.getDisplayName()!=null && !userDetails.getDisplayName().equals(""))
            user.setDisplayName(userDetails.getDisplayName());
        if(userDetails.getMail()!=null && !userDetails.getMail().equals(""))
            user.setMail(userDetails.getMail());

        //ce sont des fks, pas besoin de gérer
        user.setAvatarId(userDetails.getAvatarId());
        user.setLevelId(userDetails.getLevelId());

        //switcher isCounselor est géré dans "/switchCounselor"
        if(userDetails.getBirth()!=null && !userDetails.getBirth().toString().equals(""))
            user.setBirth(userDetails.getBirth());
        if(userDetails.getTel()!=null && !userDetails.getTel().equals(""))
            user.setTel(userDetails.getTel());
        if(userDetails.isVerify())
            user.setVerify(userDetails.isVerify());
        if(userDetails.getStatus()!=null && !userDetails.getStatus().equals(""))
            user.setStatus(userDetails.getStatus());
        if(userDetails.getPhoto()!=null && !userDetails.getPhoto().equals(""))
            user.setPhoto(userDetails.getPhoto());
        if(userDetails.getIdentityDocument()!=null && !userDetails.getIdentityDocument().equals(""))
            user.setIdentityDocument(userDetails.getIdentityDocument());
        if(userDetails.getDevice()!=null && !userDetails.getDevice().equals(""))
            user.setDevice(userDetails.getDevice());
        final User updatedUser = userService.updateUserWithoutPassword(user);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/switchCounselor")
    public ResponseEntity < User > updateUser(@Valid @RequestBody User userDetails) throws Exception {
        User user = userService.getUserById(userDetails.getUserId())
                .orElseThrow(() -> new Exception("User not found for this id :: " + userDetails.getUserId()));
        if(userDetails.getUserName().contains("/")){
            throw new Exception("username cannot contains '/'");
        }

        user.setCounselor(!user.isCounselor());

        final User updatedUser = userService.saveUser(user);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/tag/interests/{tagName}")
    public ResponseEntity < Tag > updateInterestsTag(@PathVariable(value = "tagName") String label,
                                              @Valid @RequestBody User userDetails) throws Exception {
        User user = userService.getUserById(userDetails.getUserId())
                .orElseThrow(() -> new Exception("User not found for this id :: " + userDetails.getUserId()));
        if (userDetails.getUserName().contains("/")) {
            throw new Exception("username cannot contains '/'");
        }

        Optional<Tag> tag = userService.updateInterestsTag(label, userDetails.getUserId());
        if (tag.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            //throw new Exception("label already exists in this user's profile.");
        }
        return ResponseEntity.ok(tag.get());
    }

    @DeleteMapping("/tag/interests/{id}")
    public Map< String, Boolean > deleteInterestsTag(@PathVariable(value = "id") Long tagId,
                                                     @Valid @RequestBody User userDetails) throws Exception {
        User user = userService.getUserById(userDetails.getUserId())
                .orElseThrow(() -> new Exception("User not found for this id :: " + userDetails.getUserId()));
        if (userDetails.getUserName().contains("/")) {
            throw new Exception("username cannot contains '/'");
        }

        userService.deleteInterestsTag(tagId, userDetails.getUserId());
        Map < String, Boolean > response = new HashMap< >();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

    @PutMapping("/tag/ability/{tagName}")
    public ResponseEntity < Tag > updateAbilityTag(@PathVariable(value = "tagName") String label,
                                                     @Valid @RequestBody User userDetails) throws Exception {
        User user = userService.getUserById(userDetails.getUserId())
                .orElseThrow(() -> new Exception("User not found for this id :: " + userDetails.getUserId()));
        if (userDetails.getUserName().contains("/")) {
            throw new Exception("username cannot contains '/'");
        }

        Optional<Tag> tag = userService.updateAbilityTag(label, userDetails.getUserId());
        if (tag.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            //throw new Exception("label already exists in this user's profile.");
        }
        return ResponseEntity.ok(tag.get());
    }

    @DeleteMapping("/tag/ability/{id}")
    public Map< String, Boolean > deleteAbilityTag(@PathVariable(value = "id") Long tagId,
                                                     @Valid @RequestBody User userDetails) throws Exception {
        User user = userService.getUserById(userDetails.getUserId())
                .orElseThrow(() -> new Exception("User not found for this id :: " + userDetails.getUserId()));
        if (userDetails.getUserName().contains("/")) {
            throw new Exception("username cannot contains '/'");
        }

        userService.deleteAbilityTag(tagId, userDetails.getUserId());
        Map < String, Boolean > response = new HashMap< >();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

}
