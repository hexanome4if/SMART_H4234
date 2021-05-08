package fr.insa_lyon.smart_back.repository;

import fr.insa_lyon.smart_back.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {

    @Query("SELECT e FROM Education e WHERE e.userId = ?1")
    Iterable<Education> findByUserId(long userId);

    @Query("SELECT e.userId FROM Education e WHERE e.instituteId = ?1")
    List<Long> getUserIdsByInstituteId(String instituteId);

    @Query("SELECT e.userId FROM Education e WHERE e.label LIKE %:label%")
    List<Long> getUserIdsByLabel(@Param("label") String label);

}
