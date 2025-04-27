package com.mykanban.backend.controller;

import com.mykanban.backend.model.KanbanCard;
import com.mykanban.backend.service.KanbanCardService;
import com.mykanban.backend.dto.CardResponseDTO; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
// import java.util.List; 
// import java.util.stream.Collectors; 

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "http://localhost:5173") 
public class KanbanCardController {

    private final KanbanCardService cardService;

    @Autowired
    public KanbanCardController(KanbanCardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardResponseDTO> getCardById(@PathVariable Long id) {
        Optional<KanbanCard> cardOptional = cardService.getCardById(id);
        return cardOptional.map(card -> {
            CardResponseDTO dto = new CardResponseDTO(
                card.getId(),
                card.getTitle(),
                card.getDescription(),
                card.getOrderIndex(),
                card.getColumn().getId()
            );
            return ResponseEntity.ok(dto);
        })
        .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CardResponseDTO> createCard(@RequestBody KanbanCardCreateRequest request) {

        KanbanCard newCard = new KanbanCard();
        newCard.setTitle(request.getTitle());
        newCard.setDescription(request.getDescription());
        newCard.setOrderIndex(request.getOrderIndex());

        KanbanCard createdCard = cardService.createCard(newCard, request.getColumnId());

        CardResponseDTO dto = new CardResponseDTO(
            createdCard.getId(),
            createdCard.getTitle(),
            createdCard.getDescription(),
            createdCard.getOrderIndex(),
            createdCard.getColumn().getId()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CardResponseDTO> updateCard(@PathVariable Long id, @RequestBody KanbanCard updatedCardData) {
        Optional<KanbanCard> updatedCardOptional = cardService.updateCard(id, updatedCardData);

        return updatedCardOptional.map(card -> {
            CardResponseDTO dto = new CardResponseDTO(
                card.getId(),
                card.getTitle(),
                card.getDescription(),
                card.getOrderIndex(),
                card.getColumn().getId()
            );
            return ResponseEntity.ok(dto);
        })
        .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id) {
        cardService.deleteCard(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{cardId}/move/{newColumnId}")
    public ResponseEntity<CardResponseDTO> moveCard(@PathVariable Long cardId, @PathVariable Long newColumnId) {
        Optional<KanbanCard> movedCardOptional = cardService.moveCard(cardId, newColumnId);

        return movedCardOptional.map(card -> {
             CardResponseDTO dto = new CardResponseDTO(
                 card.getId(),
                 card.getTitle(),
                 card.getDescription(),
                 card.getOrderIndex(),
                 card.getColumn().getId()
             );
             return ResponseEntity.ok(dto);
         })
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