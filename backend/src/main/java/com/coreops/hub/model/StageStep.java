package com.coreops.hub.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "stage_steps", indexes = {
    @Index(name = "idx_step_stage", columnList = "stage_id"),
    @Index(name = "idx_step_number", columnList = "step_number")
})
public class StageStep {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "stage_step_seq")
    @SequenceGenerator(name = "stage_step_seq", sequenceName = "stage_step_seq", allocationSize = 1)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_id", nullable = false)
    private Stage stage;
    
    @Column(name = "step_number", nullable = false)
    private Integer stepNumber;
    
    @NotBlank(message = "Step name is required")
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(columnDefinition = "CLOB")
    private String description;
    
    @Column(name = "step_type", length = 50)
    private String stepType;
    
    @Column(nullable = false)
    private boolean required = false;
    
    @Column(columnDefinition = "CLOB")
    private String configuration;
}
