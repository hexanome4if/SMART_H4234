package fr.insa_lyon.smart_back.service;

import fr.insa_lyon.smart_back.model.QuestionAnswer;
import fr.insa_lyon.smart_back.repository.FAQRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Data
@Service
public class FAQService {

    @Autowired
    private FAQRepository faqRepository;

    public QuestionAnswer saveQuestion (QuestionAnswer qa) {
        return faqRepository.save(qa);
    }

    public Optional<QuestionAnswer> getQuestionByQAId (long qaId) {
        return faqRepository.findById(qaId);
    }

    public Iterable<QuestionAnswer> getQuestions (long userId) {
        return faqRepository.findByMentionedUserId(userId);
    }

    public Iterable<QuestionAnswer> getQuestionsWithoutUserDetails (long userId) {
        Iterable<QuestionAnswer> qas = faqRepository.findByMentionedUserId(userId);
        for(QuestionAnswer qa : qas) {
            qa.setUser(null);
        }
        return qas;
    }

    public void deleteQuestion(final long id) {
        faqRepository.deleteById(id);
    }

}
