package com.coreops.hub.model;

import com.coreops.hub.config.LongDeserializer;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "test_runs", indexes = {
    @Index(name = "idx_testrun_template", columnList = "template_id"),
    @Index(name = "idx_testrun_user", columnList = "user_id")
})
@JsonIgnoreProperties(ignoreUnknown = true)
public class TestRun {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "test_run_seq")
    @SequenceGenerator(name = "test_run_seq", sequenceName = "test_run_seq", allocationSize = 1)
    @JsonDeserialize(using = LongDeserializer.class)
    private Long id;
    
    @Column(name = "template_id", nullable = false)
    private Long templateId;
    
    @Column(name = "template_name", nullable = false, length = 100)
    private String templateName;
    
    @Column(name = "current_stage_index")
    private Integer currentStageIndex = 0;
    
    @OneToMany(mappedBy = "testRun", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TestRunStage> stages = new ArrayList<>();
    
    @Column(name = "started_at", nullable = false)
    private Instant startedAt;
    
    @Column(name = "submitted_at")
    private Instant submittedAt;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(length = 20)
    private String status = "RUNNING";
    
    public void addStage(TestRunStage stage) {
        stages.add(stage);
        stage.setTestRun(this);
    }
    
    public void removeStage(TestRunStage stage) {
        stages.remove(stage);
        stage.setTestRun(null);
    }
}
