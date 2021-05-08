package fr.insa_lyon.smart_back.repository;

import fr.insa_lyon.smart_back.model.Education;
import fr.insa_lyon.smart_back.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    @Query(value = "SELECT t.* FROM tag t WHERE t.label = ?1", nativeQuery = true)
    List<Tag> findTagByLabel(String label);

    @Query(value = "SELECT COUNT(*) FROM educationtag et WHERE et.tag_id=?1 and et.education_id=?2", nativeQuery = true)
    long countEducationTag(long tagId, long educationTag);

    @Query(value = "INSERT INTO educationtag VALUES(?1,?2)", nativeQuery = true)
    void insertEducationTag(long tagId, long educationTag);

    @Query(value = "SELECT et.tag_id FROM educationtag et WHERE et.education_id=?1", nativeQuery = true)
    List<Long> getTagsEducation(long educationTag);

    @Query(value = "DELETE FROM educationtag WHERE tag_id=?1 and education_id=?2", nativeQuery = true)
    void deleteTagEducation(long tagId, long educationId);

    @Query(value = "SELECT t.* FROM tag t LEFT JOIN userabilitytag ua ON t.tag_id = ua.tag_id WHERE ua.user_id = ?1", nativeQuery = true)
    Iterable<Tag> getAbilityTagById(long userId);

    @Query(value = "INSERT INTO userabilitytag VALUES(?1,?2)", nativeQuery = true)
    void insertAbilityTag(long userId, long abilityId);

    @Query(value = "DELETE FROM userabilitytag WHERE user_id=?1 AND tag_id=?2", nativeQuery = true)
    void deleteAbilityTag(long userId, long abilityId);

    @Query(value = "SELECT t.* FROM tag t LEFT JOIN userintereststag ui ON t.tag_id = ui.tag_id WHERE ui.user_id = ?1", nativeQuery = true)
    Iterable<Tag> getUserInterestsTagById(long userId);

    @Query(value = "INSERT INTO userinteresttag VALUES(?1,?2)", nativeQuery = true)
    void insertInterestsTag(long userId, long interestsId);

    @Query(value = "DELETE FROM userinteresttag WHERE user_id=?1 AND tag_id=?2", nativeQuery = true)
    void deleteInterestsTag(long userId, long interestsId);

    @Query(value = "SELECT COUNT(*) FROM experiencetag et WHERE et.tag_id=?1 and et.experience_id=?2", nativeQuery = true)
    long countExperienceTag(long tagId, long experienceId);

    @Query(value = "INSERT INTO experiencetag VALUES(?1,?2)", nativeQuery = true)
    void insertExperienceTag(long tagId, long experienceId);

    @Query(value = "SELECT et.tag_id FROM experiencetag et WHERE et.experience_id=?1", nativeQuery = true)
    List<Long> getTagsExperience(long experienceId);

    @Query(value = "DELETE FROM experiencetag WHERE tag_id=?1 and experience_id=?2", nativeQuery = true)
    void deleteTagExperience(long tagId, long experienceId);

    @Query(value = "SELECT uat.user_id FROM userabilitytag uat INNER JOIN tag t ON uat.tag_id=t.tag_id WHERE t.label LIKE %:label%", nativeQuery = true)
    List<Long> getSuggestions(@Param("label") String label);

}
