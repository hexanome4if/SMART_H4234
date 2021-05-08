package fr.insa_lyon.smart_back.repository;

import fr.insa_lyon.smart_back.model.Avatar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvatarRepository extends JpaRepository<Avatar, Long> {

    @Query("SELECT a FROM Avatar a")
    List<Avatar> getListAvatar();
}
