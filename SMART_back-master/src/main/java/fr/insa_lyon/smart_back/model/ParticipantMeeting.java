package fr.insa_lyon.smart_back.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="participantmeeting")
public class ParticipantMeeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long participantMeetingId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "meeting_id")
    private Meeting meeting;

    @Column(name = "accepted", nullable = false)
    private boolean accepted;

    @Column(name = "cancelled", nullable = false)
    private boolean cancelled;

    @Column(name = "initiator", nullable = false)
    private boolean initiator;

    public ParticipantMeeting() {
    }

}
