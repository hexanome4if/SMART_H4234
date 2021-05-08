package fr.insa_lyon.smart_back.repository;

import fr.insa_lyon.smart_back.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> { //gère les requêtes SQL, communiquer avec la source de données

    @Query("SELECT u FROM User u WHERE u.userName = ?1")
    Optional<User> findByUserName(String username);

    @Query("SELECT u.mail FROM User u")
    List<String> getListMail();

    @Query("SELECT u.userName FROM User u")
    List<String> getListUserName();

    @Query("SELECT u.avatar FROM User u WHERE u.userId = ?1")
    Avatar getAvatar(long userId);

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.avatarId = ?2, u.avatar = ?3 WHERE u.userId = ?1" )
    void setAvatar(long userId, long avatarId, Avatar avatar);
    
}