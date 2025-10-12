package com.coreops.hub.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TemplateStage {
    private String name;
    private List<String> availableOptions;
    private List<String> availableChecklists;
}
