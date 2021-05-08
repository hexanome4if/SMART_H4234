package fr.insa_lyon.smart_back.repository;

import fr.insa_lyon.smart_back.model.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LevelRepository extends JpaRepository<Level, Long> {
}
