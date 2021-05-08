package fr.insa_lyon.smart_back.repository;

import fr.insa_lyon.smart_back.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Long> {

    @Query("SELECT ex FROM Experience ex WHERE ex.userId = ?1")
    Iterable<Experience> findByUserId(long userId);

    @Query("SELECT ex.userId FROM Experience ex WHERE ex.siret = ?1")
    List<Long> getUserIdsBySiret(String siret);

}
