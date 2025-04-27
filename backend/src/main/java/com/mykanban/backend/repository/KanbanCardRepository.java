package com.mykanban.backend.repository;

import com.mykanban.backend.model.KanbanCard;
import com.mykanban.backend.model.KanbanColumn;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KanbanCardRepository extends JpaRepository<KanbanCard, Long> {
    List<KanbanCard> findByColumn(KanbanColumn column);
}