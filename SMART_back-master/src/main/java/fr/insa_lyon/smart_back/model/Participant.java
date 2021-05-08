package fr.insa_lyon.smart_back.model;

import lombok.Data;
import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;

@Data
@Entity
@Table(name="participant")
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long participantId;

    @Column(
            name = "chat_id"
    )
    private long chatId;

    /*@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id", insertable = false, updatable = false)
    private Chat chat;*/

    @Column(
            name = "user_id"
    )
    private long userId;
    /*@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;*/

    @Column(name = "last_open_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastOpen;

    @Column(name = "accepted")
    private Boolean accepted;

    public Participant() {
    }

    public Participant(Timestamp time, Boolean accepted) {
        this.lastOpen = time;
        this.accepted = accepted;
    }
}
