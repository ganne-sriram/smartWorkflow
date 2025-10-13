package com.coreops.hub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "test_run_stages")
public class TestRunStage {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "test_run_stage_seq")
    @SequenceGenerator(name = "test_run_stage_seq", sequenceName = "test_run_stage_seq", allocationSize = 1)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_run_id", nullable = false)
    @JsonIgnore
    private TestRun testRun;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @ElementCollection
    @CollectionTable(name = "test_run_stage_available_options", joinColumns = @JoinColumn(name = "test_run_stage_id"))
    @Column(name = "option_value")
    private List<String> availableOptions = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "test_run_stage_available_checklists", joinColumns = @JoinColumn(name = "test_run_stage_id"))
    @Column(name = "checklist_value")
    private List<String> availableChecklists = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "test_run_stage_selected_options", joinColumns = @JoinColumn(name = "test_run_stage_id"))
    @Column(name = "option_value")
    private List<String> selectedOptions = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "test_run_stage_selected_checklists", joinColumns = @JoinColumn(name = "test_run_stage_id"))
    @Column(name = "checklist_value")
    private List<String> selectedChecklists = new ArrayList<>();
    
    @Column(length = 20)
    private String status = "PENDING";
}
