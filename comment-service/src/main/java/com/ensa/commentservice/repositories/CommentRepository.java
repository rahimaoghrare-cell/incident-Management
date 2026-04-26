package com.ensa.commentservice.repositories;

import com.ensa.commentservice.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Cette méthode permet de récupérer tous les commentaires d'un incident précis
    List<Comment> findByIncidentId(Long incidentId);
}