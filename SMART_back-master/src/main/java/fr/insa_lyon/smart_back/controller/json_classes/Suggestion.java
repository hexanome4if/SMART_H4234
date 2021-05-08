package fr.insa_lyon.smart_back.controller.json_classes;

import lombok.Data;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Data
public class Suggestion implements Comparator<Suggestion>, Comparable<Suggestion> {
    private Long userId;
    private Double note;
    private List<String> tags;

    public Suggestion() {

    }

    public Suggestion(Long userId, TreeMap<Double, List<String>> commun) {
        this.userId = userId;
        this.note = commun.firstKey();
        this.tags = commun.firstEntry().getValue();
    }

    // Overriding the compareTo method
    @Override
    public int compareTo(Suggestion s1) {
        if (this.note > s1.note) {
            return 1;
        } else if (this.note < s1.note) {
            return -1;
        }
        return 0;
    }

    // Overriding the compare method to sort the age
    @Override
    public int compare(Suggestion s, Suggestion s1) {
        if (s.note > s1.note) {
            return 1;
        } else if (s.note < s1.note) {
            return -1;
        }
        return 0;
    }
}
