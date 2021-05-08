package fr.insa_lyon.smart_back.model;

import lombok.Data;
import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name="chat")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long chatId;

    @OneToMany(
    cascade = CascadeType.ALL,
    orphanRemoval = true
    )
    @JoinColumn(name = "chat_id")
    private List<Message> messages;

    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JoinColumn(name = "chat_id")
    private List<Participant> participants;

    @Column(name = "last_message_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastMessageDate;

    @Column(name = "label")
    private String label;

    public Chat() {
    }

    public Chat(String label, Timestamp lastMessageDate) {
        this.label = label;
        this.lastMessageDate = lastMessageDate;
    }
}
