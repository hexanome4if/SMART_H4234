package fr.insa_lyon.smart_back.controller;

import fr.insa_lyon.smart_back.model.QuestionAnswer;
import fr.insa_lyon.smart_back.model.User;
import fr.insa_lyon.smart_back.service.FAQService;
import fr.insa_lyon.smart_back.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

@RestController
public class FAQController {

    @Autowired
    private FAQService faqService;

    @Autowired
    private UserService userService;


    @PostMapping("/faq")
    public Iterable<QuestionAnswer> getQuestionsByUserId(@Valid @RequestBody User userData) throws Exception {
        return faqService.getQuestions(userData.getUserId());
    }

    @GetMapping("/faq/{id}")
    public ResponseEntity <QuestionAnswer> getQuestionById(@PathVariable(value = "id") Long qaId) throws Exception {
        QuestionAnswer qa = faqService.getQuestionByQAId(qaId)
                .orElseThrow(() -> new Exception("Question not found for this id :: " + qaId));
        return ResponseEntity.ok(qa);
    }

    @PutMapping("/faq/ask/{userid}")
    public ResponseEntity <QuestionAnswer> askQuestion(@PathVariable(value = "userid") Long userId,
                                                       @Valid @RequestBody QuestionAnswer question) throws Exception {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new Exception("User not found for this id :: " + userId));
        question.setUser(user);
        QuestionAnswer savedQuestion = faqService.saveQuestion(question);
        return ResponseEntity.ok(savedQuestion);
    }

    @PutMapping("/faq/answer/{questionId}")
    public ResponseEntity <QuestionAnswer> answerQuestion(@PathVariable(value = "questionId") Long qaId,
                                                          @Valid @RequestBody QuestionAnswer questionReplied) throws Exception {
        QuestionAnswer qa = faqService.getQuestionByQAId(qaId)
                .orElseThrow(() -> new Exception("Question not found for this id :: " + qaId));
        System.out.println(questionReplied.getQaId());
        if (qa.getQaId() != questionReplied.getQaId()) {
            throw new Exception("Variable id didn't match qaId in RequestBody");
        } else {
            qa.setAnswer(questionReplied.getAnswer());
        }
        QuestionAnswer savedQuestion = faqService.saveQuestion(qa);
        return ResponseEntity.ok(savedQuestion);
    }

    @DeleteMapping("/faq/{id}")
    public Map< String, Boolean > deleteQuestion(@PathVariable(value = "id") Long qaId,
                                                 @Valid @RequestBody User userDetails) throws Exception {
        User user = userService.getUserById(userDetails.getUserId())
                .orElseThrow(() -> new Exception("User not found for this id :: " + userDetails.getUserId()));
        if (userDetails.getUserName().contains("/")) {
            throw new Exception("username cannot contains '/'");
        }

        QuestionAnswer target = faqService.getQuestionByQAId(qaId)
                .orElseThrow(() -> new Exception("Question not found for this id :: " + qaId));

        Map < String, Boolean > response = new HashMap< >();

        // Si on essaie de supprimer les questions des autres
        if (target.getUser().getUserId() != user.getUserId()) {
            response.put("Not authorized", Boolean.FALSE);
        } else {
            faqService.deleteQuestion(target.getQaId());
            response.put("deleted", Boolean.TRUE);
        }
        return response;
    }
}
