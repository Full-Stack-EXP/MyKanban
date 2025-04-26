package com.mykanban.backend.controller;

import com.mykanban.backend.model.KanbanColumn;
import com.mykanban.backend.model.KanbanCard;
import com.mykanban.backend.service.KanbanColumnService;
import com.mykanban.backend.service.KanbanCardService; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity; 
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional; 

@RestController 
@RequestMapping("/api/columns") 
@CrossOrigin(origins = "http://localhost:3000")
public class KanbanColumnController {

    private final KanbanColumnService columnService;
    private final KanbanCardService cardService;

    @Autowired 
    public KanbanColumnController(KanbanColumnService columnService, KanbanCardService cardService) {
        this.columnService = columnService;
        this.cardService = cardService;
    }

    @GetMapping
    public ResponseEntity<List<KanbanColumn>> getAllColumns() {
        List<KanbanColumn> columns = columnService.getAllColumns(); 
        return ResponseEntity.ok(columns);
    }

    @GetMapping("/{id}")
    public ResponseEntity<KanbanColumn> getColumnById(@PathVariable Long id) {
        Optional<KanbanColumn> column = columnService.getColumnById(id);
        return column.map(ResponseEntity::ok) 
                    .orElseGet(() -> ResponseEntity.notFound().build()); 
    }

    @PostMapping
    public ResponseEntity<KanbanColumn> createColumn(@RequestBody KanbanColumn column) {
        KanbanColumn createdColumn = columnService.createColumn(column); 
        return ResponseEntity.status(HttpStatus.CREATED).body(createdColumn);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KanbanColumn> updateColumn(@PathVariable Long id, @RequestBody KanbanColumn updatedColumnData) {

        Optional<KanbanColumn> updatedColumn = columnService.updateColumn(id, updatedColumnData);
        return updatedColumn.map(ResponseEntity::ok) 
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColumn(@PathVariable Long id) {
        columnService.deleteColumn(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{columnId}/cards")
    public ResponseEntity<List<KanbanCard>> getCardsForColumn(@PathVariable Long columnId) {
        if (!columnService.getColumnById(columnId).isPresent()) {
            return ResponseEntity.notFound().build(); 
        }
        List<KanbanCard> cards = cardService.getCardsByColumnId(columnId); 

         return ResponseEntity.ok(cards); 
    }
}