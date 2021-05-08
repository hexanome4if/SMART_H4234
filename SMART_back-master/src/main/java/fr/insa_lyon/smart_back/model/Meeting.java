package fr.insa_lyon.smart_back.model;

import lombok.Data;
import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;

@Data
@Entity
@Table(name="meeting")
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long meetingId;

    @Column(name = "label", nullable = false)
    private String label;

    @Column(name = "meet_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    public Meeting() {
    }

    public Meeting(String label, Timestamp date) {
        this.label = label;
        this.date = date;
    }


}
