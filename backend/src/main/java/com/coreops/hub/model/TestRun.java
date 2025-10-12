package com.coreops.hub.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "test_runs")
public class TestRun {
    @Id
    private String id;
    
    private String templateId;
    
    private String templateName;
    
    private Integer currentStageIndex;
    
    private List<TestRunStage> stages;
    
    private Instant startedAt;
    
    private Instant submittedAt;
    
    private String userId;
}
