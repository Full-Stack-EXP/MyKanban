package com.mykanban.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColumnResponseDTO {
    private Long id;
    private String name;
    private Integer orderIndex;
    private List<CardResponseDTO> cards;
}