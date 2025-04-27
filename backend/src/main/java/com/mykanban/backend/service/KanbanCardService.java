package com.mykanban.backend.service;

import com.mykanban.backend.model.KanbanCard;
import com.mykanban.backend.model.KanbanColumn;
import com.mykanban.backend.repository.KanbanCardRepository;
import com.mykanban.backend.repository.KanbanColumnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;


@Service
public class KanbanCardService {

    private final KanbanCardRepository cardRepository;
    private final KanbanColumnRepository columnRepository;

    @Autowired
    public KanbanCardService(KanbanCardRepository cardRepository, KanbanColumnRepository columnRepository) {
        this.cardRepository = cardRepository;
        this.columnRepository = columnRepository;
    }

    public KanbanCard createCard(KanbanCard card, Long columnId) {
        KanbanColumn column = columnRepository.findById(columnId)
            .orElseThrow(() -> new RuntimeException("Column not found with ID: " + columnId));

        card.setColumn(column);
        return cardRepository.save(card);
    }

    public Optional<KanbanCard> getCardById(Long id) {
        return cardRepository.findById(id);
    }

    public List<KanbanCard> getAllCards() {
        return cardRepository.findAll();
    }

    public List<KanbanCard> getCardsByColumnId(Long columnId) {
        KanbanColumn column = columnRepository.findById(columnId)
            .orElseThrow(() -> new RuntimeException("Column not found with ID: " + columnId));

        return cardRepository.findByColumn(column);
    }

    public Optional<KanbanCard> updateCard(Long id, KanbanCard updatedCardData) {
        return cardRepository.findById(id).map(card -> {
            card.setTitle(updatedCardData.getTitle());
            card.setDescription(updatedCardData.getDescription());
            return cardRepository.save(card);
        });
    }

    public void deleteCard(Long id) {
        cardRepository.deleteById(id);
    }

    public Optional<KanbanCard> moveCard(Long cardId, Long newColumnId) {
        return cardRepository.findById(cardId).flatMap(card -> {
            Optional<KanbanColumn> newColumnOptional = columnRepository.findById(newColumnId);
            if (newColumnOptional.isPresent()) {
                KanbanColumn newColumn = newColumnOptional.get();
                card.setColumn(newColumn);
                return Optional.of(cardRepository.save(card));
            } else {
                throw new RuntimeException("New Column not found with ID: " + newColumnId);
            }
        });
    }
}