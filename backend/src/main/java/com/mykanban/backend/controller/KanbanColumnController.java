package com.mykanban.backend.controller;

import com.mykanban.backend.model.KanbanColumn;
import com.mykanban.backend.service.KanbanColumnService;
import com.mykanban.backend.dto.ColumnResponseDTO;
import com.mykanban.backend.dto.CardResponseDTO;
// import com.mykanban.backend.model.KanbanCard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@RestController
@RequestMapping("/api/columns")
@CrossOrigin(origins = "http://localhost:5173")
public class KanbanColumnController {

    private final KanbanColumnService columnService;

    @Autowired
    public KanbanColumnController(KanbanColumnService columnService) {
        this.columnService = columnService;
    }

    @GetMapping
    public ResponseEntity<List<ColumnResponseDTO>> getAllColumns() {
        List<KanbanColumn> columns = columnService.getAllColumns();

        List<ColumnResponseDTO> columnDTOs = columns.stream().map(column -> {
            List<CardResponseDTO> cardDTOs = column.getCards().stream().map(card ->
                new CardResponseDTO(
                    card.getId(),
                    card.getTitle(),
                    card.getDescription(),
                    card.getOrderIndex(),
                    card.getColumn().getId()
                )
            ).collect(Collectors.toList());

            return new ColumnResponseDTO(
                column.getId(),
                column.getName(),
                column.getOrderIndex(),
                cardDTOs
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(columnDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ColumnResponseDTO> getColumnById(@PathVariable Long id) {
        Optional<KanbanColumn> columnOptional = columnService.getColumnById(id);
    
        return columnOptional
            .map(column -> {
                List<CardResponseDTO> cardDTOs = column.getCards().stream().map(card ->
                    new CardResponseDTO(
                        card.getId(),
                        card.getTitle(),
                        card.getDescription(),
                        card.getOrderIndex(),
                        card.getColumn().getId()
                    )
                ).collect(Collectors.toList());

                return new ColumnResponseDTO(
                    column.getId(),
                    column.getName(),
                    column.getOrderIndex(),
                    cardDTOs
                );
            })
            .map(ResponseEntity::ok) 
            .orElseGet(() -> ResponseEntity.notFound().build()); 
    }

    @PostMapping
    public ResponseEntity<ColumnResponseDTO> createColumn(@RequestBody ColumnCreateRequest request) {
        KanbanColumn newColumn = new KanbanColumn();
        newColumn.setName(request.getName());
        KanbanColumn createdColumn = columnService.createColumn(newColumn);

        List<CardResponseDTO> cardDTOs = createdColumn.getCards().stream().map(card ->
            new CardResponseDTO(
                card.getId(),
                card.getTitle(),
                card.getDescription(),
                card.getOrderIndex(),
                card.getColumn().getId()
            )
        ).collect(Collectors.toList());

        ColumnResponseDTO createdColumnDTO = new ColumnResponseDTO(
            createdColumn.getId(),
            createdColumn.getName(),
            createdColumn.getOrderIndex(),
            cardDTOs
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(createdColumnDTO);
    }

    @PutMapping("/{id}")
public ResponseEntity<ColumnResponseDTO> updateColumn(@PathVariable Long id, @RequestBody KanbanColumn updatedColumnData) {
    Optional<KanbanColumn> updatedColumnOptional = columnService.updateColumn(id, updatedColumnData);

    return updatedColumnOptional
        .map(column -> {
             List<CardResponseDTO> cardDTOs = column.getCards().stream().map(card ->
                 new CardResponseDTO(
                     card.getId(),
                     card.getTitle(),
                     card.getDescription(),
                     card.getOrderIndex(),
                     card.getColumn().getId()
                 )
             ).collect(Collectors.toList());

             return new ColumnResponseDTO(
                 column.getId(),
                 column.getName(),
                 column.getOrderIndex(),
                 cardDTOs
             );
        })
        .map(ResponseEntity::ok) 
        .orElseGet(() -> ResponseEntity.notFound().build()); 
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColumn(@PathVariable Long id) {
        columnService.deleteColumn(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<List<ColumnResponseDTO>> reorderColumns(@RequestBody List<KanbanColumn> reorderedColumns) {
        List<KanbanColumn> updatedColumnEntities = columnService.reorderColumns(reorderedColumns);

        List<ColumnResponseDTO> updatedColumnDTOs = updatedColumnEntities.stream().map(column -> {
             List<CardResponseDTO> cardDTOs = column.getCards().stream().map(card ->
                 new CardResponseDTO(
                     card.getId(),
                     card.getTitle(),
                     card.getDescription(),
                     card.getOrderIndex(),
                     card.getColumn().getId()
                 )
             ).collect(Collectors.toList());

             return new ColumnResponseDTO(
                 column.getId(),
                 column.getName(),
                 column.getOrderIndex(),
                 cardDTOs
             );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(updatedColumnDTOs);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class ColumnCreateRequest {
        private String name;
    }
}