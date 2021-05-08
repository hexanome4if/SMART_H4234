package fr.insa_lyon.smart_back.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
public class ProfileDTO {

    private long userId;
    private String userName;
    private String displayName;
    private String mail;
    private String password;
    private Date birth;
    private String tel;
    private boolean counselor;
    private boolean verify;
    private String status;
    private String photo;
    private String identityDocument;
    private String device;
    private long levelId;
    private Level level;
    private long avatarId;
    private Avatar avatar;
    private List<Tag> userAbilityTags;
    private List<Tag> userInterestTags;
    public List<Experience> experiences;
    public List<Education> educations;

    public Iterable<QuestionAnswer> faqs;

    public ProfileDTO() {}

    public ProfileDTO(User user) {
        this.userId = user.getUserId();
        this.userName = user.getUserName();
        this.displayName = user.getDisplayName();
        this.mail = user.getMail();
        this.password = user.getPassword();
        this.birth = user.getBirth();
        this.tel = user.getTel();
        this.counselor = user.isCounselor();
        this.verify = user.isVerify();
        this.status = user.getStatus();
        this.photo = user.getPhoto();
        this.identityDocument = user.getIdentityDocument();
        this.device = user.getDevice();
        this.level = user.getLevel();
        this.levelId = user.getLevelId();
        this.avatar = user.getAvatar();
        this.avatarId = user.getAvatarId();
        this.userAbilityTags = user.getUserAbilityTags();
        this.userInterestTags = user.getUserInterestTags();
        this.educations = user.getEducations();
        this.experiences = user.getExperiences();
    }
}
