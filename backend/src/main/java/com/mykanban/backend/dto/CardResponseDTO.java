package com.mykanban.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardResponseDTO {
    private Long id;
    private String title;
    private String description;
    private Integer orderIndex;
    private Long columnId;
}