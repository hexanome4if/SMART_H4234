package fr.insa_lyon.smart_back.model;

import lombok.Data;
import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;

@Data
@Entity
@Table(name="message")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;

    @Column(
            name = "user_id"
    )
    private long userId;
    /*@ManyToOne
    @JoinColumn(name = "user_id")
    private User user;*/
    /*
    @JoinColumn(name = "chat_id")
    @ManyToOne //(fetch = FetchType.LAZY)
    private Chat chat;*/

    @Column(
            name = "chat_id"
    )
    private long chatId;

    @Column(name = "msg_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date msgDate;

    @Column(name = "type")
    private String type;

    @Column(name = "content")
    private String content;

    public Message() {
    }

    public Message(MessageDTO messageDTO, long userId, long chatId, Timestamp time) {
        this.type = messageDTO.getType();
        this.content = messageDTO.getContent();
        this.userId = userId;
        this.chatId = chatId;
        this.msgDate = time;
    }

    public Message(String type, String content, Timestamp time) {
        this.type = type;
        this.content = content;
        this.msgDate = time;
    }

    /*public long getUserId() {
        return this.user.getUserId();
    }*/

}
