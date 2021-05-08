package fr.insa_lyon.smart_back.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name="questionanswer")
public class QuestionAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long qaId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "question", nullable = false)
    private String question;

    @Column(name = "answer", nullable = false)
    private String answer;

    public QuestionAnswer() {
    }

    public QuestionAnswer(String question, String answer) {
        this.question = question;
        this.answer = answer;
    }
}
