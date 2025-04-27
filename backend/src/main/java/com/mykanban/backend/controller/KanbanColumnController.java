package com.mykanban.backend.controller;

import com.mykanban.backend.model.KanbanColumn;
import com.mykanban.backend.service.KanbanColumnService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
    public ResponseEntity<KanbanColumn> createColumn(@RequestBody ColumnCreateRequest request) {
        KanbanColumn newColumn = new KanbanColumn();
        newColumn.setName(request.getName());
        KanbanColumn createdColumn = columnService.createColumn(newColumn);
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

    @PutMapping("/reorder")
    public ResponseEntity<List<KanbanColumn>> reorderColumns(@RequestBody List<KanbanColumn> reorderedColumns) {
        List<KanbanColumn> updatedColumns = columnService.reorderColumns(reorderedColumns);
        return ResponseEntity.ok(updatedColumns);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class ColumnCreateRequest {
        private String name;
    }
}