package com.mykanban.backend.controller;

import com.mykanban.backend.model.KanbanCard; 
import com.mykanban.backend.service.KanbanCardService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity; 
import org.springframework.web.bind.annotation.*;

import java.util.Optional; 

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@RestController 
@RequestMapping("/api/cards")
@CrossOrigin(origins = "http://localhost:3000") 
public class KanbanCardController {

    private final KanbanCardService cardService;

    @Autowired
    public KanbanCardController(KanbanCardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<KanbanCard> getCardById(@PathVariable Long id) {
        Optional<KanbanCard> card = cardService.getCardById(id); 
        return card.map(ResponseEntity::ok) 
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<KanbanCard> createCard(@RequestBody KanbanCardCreateRequest request) {

        KanbanCard newCard = new KanbanCard();
        newCard.setTitle(request.getTitle());
        newCard.setDescription(request.getDescription());
        newCard.setOrderIndex(request.getOrderIndex());

        KanbanCard createdCard = cardService.createCard(newCard, request.getColumnId());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdCard);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KanbanCard> updateCard(@PathVariable Long id, @RequestBody KanbanCard updatedCardData) {
        Optional<KanbanCard> updatedCard = cardService.updateCard(id, updatedCardData);

        return updatedCard.map(ResponseEntity::ok) 
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id) {
        cardService.deleteCard(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{cardId}/move/{newColumnId}")
    public ResponseEntity<KanbanCard> moveCard(@PathVariable Long cardId, @PathVariable Long newColumnId) {
        Optional<KanbanCard> movedCard = cardService.moveCard(cardId, newColumnId);

        return movedCard.map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class KanbanCardCreateRequest {
        private String title;
        private String description;
        private Integer orderIndex;
        private Long columnId;
    }
}