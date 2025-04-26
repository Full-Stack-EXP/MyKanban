package com.mykanban.backend.service;

import com.mykanban.backend.model.KanbanColumn; 
import com.mykanban.backend.model.KanbanCard;
import com.mykanban.backend.repository.KanbanColumnRepository;
import com.mykanban.backend.repository.KanbanCardRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service 
public class KanbanColumnService {

    private final KanbanColumnRepository columnRepository;
    private final KanbanCardRepository cardRepository;

    @Autowired 
    public KanbanColumnService(KanbanColumnRepository columnRepository, KanbanCardRepository cardRepository) {
        this.columnRepository = columnRepository;
        this.cardRepository = cardRepository;
    }

    /**
    * @param column 
    * @return 
    */
    public KanbanColumn createColumn(KanbanColumn column) {
        return columnRepository.save(column);
    }

    /**
    * @param id
    * @return
    */
    public Optional<KanbanColumn> getColumnById(Long id) {
        return columnRepository.findById(id);
    }

    /**
    * @return
    */
    public List<KanbanColumn> getAllColumns() {
        return columnRepository.findAllByOrderByOrderIndexAsc();
    }

    /**
    * @param id 
    * @param updatedColumnData 
    * @return
    */
    public Optional<KanbanColumn> updateColumn(Long id, KanbanColumn updatedColumnData) {
        return columnRepository.findById(id).map(column -> {

            column.setName(updatedColumnData.getName());
            column.setOrderIndex(updatedColumnData.getOrderIndex()); 

            return columnRepository.save(column); 
        });
    }

    /**
    * @param id
    */
    public void deleteColumn(Long id) {
        columnRepository.deleteById(id); 
    }

    /**
    * @param columnId 
    * @return
    */
    public List<KanbanCard> getCardsForColumn(Long columnId) {
        KanbanColumn column = columnRepository.findById(columnId)
            .orElseThrow(() -> new RuntimeException("Column not found with ID: " + columnId));

        return cardRepository.findByColumn(column);
    }
}