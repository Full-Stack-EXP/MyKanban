package com.mykanban.backend.service;

import com.mykanban.backend.model.KanbanColumn;
import com.mykanban.backend.repository.KanbanColumnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class KanbanColumnService {

    private final KanbanColumnRepository columnRepository;

    @Autowired
    public KanbanColumnService(KanbanColumnRepository columnRepository) {
        this.columnRepository = columnRepository;
    }

    public List<KanbanColumn> getAllColumns() {
        return columnRepository.findAll();
    }

    public KanbanColumn createColumn(KanbanColumn column) {
        List<KanbanColumn> existingColumns = columnRepository.findAll();
        column.setOrderIndex(existingColumns.size());
        return columnRepository.save(column);
    }

    public Optional<KanbanColumn> getColumnById(Long id) {
        return columnRepository.findById(id);
    }

    public void deleteColumn(Long id) {
        columnRepository.deleteById(id);
    }

    public Optional<KanbanColumn> updateColumn(Long id, KanbanColumn updatedColumnData) {
         return columnRepository.findById(id).map(column -> {
             column.setName(updatedColumnData.getName());
             if (updatedColumnData.getOrderIndex() != null) {
                 column.setOrderIndex(updatedColumnData.getOrderIndex());
             }
             return columnRepository.save(column);
         });
    }

    @Transactional
    public List<KanbanColumn> reorderColumns(List<KanbanColumn> reorderedColumns) {
        List<KanbanColumn> existingColumns = columnRepository.findAllById(
            reorderedColumns.stream()
                .map(KanbanColumn::getId)
                .toList()
        );

         Map<Long, KanbanColumn> existingColumnMap = existingColumns.stream()
             .collect(Collectors.toMap(KanbanColumn::getId, column -> column));


        List<KanbanColumn> updatedColumns = new ArrayList<>();

        for (KanbanColumn reorderedColumnData : reorderedColumns) {
            KanbanColumn existingColumn = existingColumnMap.get(reorderedColumnData.getId());
            if (existingColumn != null) {
                existingColumn.setOrderIndex(reorderedColumnData.getOrderIndex());
                updatedColumns.add(existingColumn);
            } else {
                 System.err.println("Warning: Column with ID " + reorderedColumnData.getId() + " not found for reordering.");
            }
        }

        return columnRepository.saveAll(updatedColumns);
    }
}