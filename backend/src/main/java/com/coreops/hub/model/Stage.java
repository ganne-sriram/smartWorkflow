package com.coreops.hub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "stages", indexes = {
    @Index(name = "idx_stage_template", columnList = "template_id"),
    @Index(name = "idx_stage_number", columnList = "stage_number")
})
public class Stage {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "stage_seq")
    @SequenceGenerator(name = "stage_seq", sequenceName = "stage_seq", allocationSize = 1)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    @JsonIgnore
    private Template template;
    
    @Column(name = "stage_number", nullable = false)
    private Integer stageNumber;
    
    @NotBlank(message = "Stage name is required")
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(length = 50)
    private String type;
    
    @Column(columnDefinition = "CLOB")
    private String description;
    
    @OneToMany(mappedBy = "stage", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<StageStep> stageSteps = new ArrayList<>();
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "stage_available_options", joinColumns = @JoinColumn(name = "stage_id"))
    @Column(name = "option_value")
    private List<String> availableOptions = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "stage_available_checklists", joinColumns = @JoinColumn(name = "stage_id"))
    @Column(name = "checklist_value")
    private List<String> availableChecklists = new ArrayList<>();
    
    public void addStageStep(StageStep step) {
        stageSteps.add(step);
        step.setStage(this);
    }
    
    public void removeStageStep(StageStep step) {
        stageSteps.remove(step);
        step.setStage(null);
    }
}
