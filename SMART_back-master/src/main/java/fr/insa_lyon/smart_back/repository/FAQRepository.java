package fr.insa_lyon.smart_back.repository;

import fr.insa_lyon.smart_back.model.QuestionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FAQRepository extends JpaRepository<QuestionAnswer, Long> {

    @Query(value = "SELECT qa.* FROM questionanswer qa WHERE qa.user_id = ?1", nativeQuery = true)
    Iterable<QuestionAnswer> findByMentionedUserId(long mentionedUserId);

}
