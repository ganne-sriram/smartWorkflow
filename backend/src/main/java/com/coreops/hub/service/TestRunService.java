package com.coreops.hub.service;

import com.coreops.hub.model.TestRun;
import com.coreops.hub.repository.TestRunRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TestRunService {
    
    @Autowired
    private TestRunRepository testRunRepository;
    
    public TestRun createTestRun(TestRun testRun, Long userId) {
        testRun.setUserId(userId);
        testRun.setStartedAt(Instant.now());
        testRun.setStatus("RUNNING");
        return testRunRepository.save(testRun);
    }
    
    public Optional<TestRun> getTestRunById(Long id) {
        return testRunRepository.findById(id);
    }
    
    public List<TestRun> getAllTestRuns() {
        return testRunRepository.findAll();
    }
    
    public TestRun updateTestRun(Long id, TestRun testRun) {
        TestRun existing = testRunRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("TestRun not found"));
        
        existing.setCurrentStageIndex(testRun.getCurrentStageIndex());
        existing.setStages(testRun.getStages());
        
        if (testRun.getSubmittedAt() != null) {
            existing.setSubmittedAt(testRun.getSubmittedAt());
            existing.setStatus("COMPLETED");
        }
        
        return testRunRepository.save(existing);
    }
}
