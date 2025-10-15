package com.coreops.hub.service;

import com.coreops.hub.model.TestRun;
import com.coreops.hub.model.TestRunStage;
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
        // Store the stages temporarily and clear them from the testRun
        List<TestRunStage> stagesToAdd = new java.util.ArrayList<>();
        if (testRun.getStages() != null && !testRun.getStages().isEmpty()) {
            stagesToAdd.addAll(testRun.getStages());
            testRun.getStages().clear();
        }

        // Clear the TestRun ID and set properties
        testRun.setId(null);
        testRun.setUserId(userId);
        testRun.setStartedAt(Instant.now());
        testRun.setStatus("RUNNING");

        // Save the TestRun first without stages to get the ID
        TestRun savedTestRun = testRunRepository.save(testRun);
        testRunRepository.flush(); // Force the ID to be generated

        // Now add the stages with the proper relationship
        for (TestRunStage stage : stagesToAdd) {
            stage.setId(null);  // Clear any existing ID
            stage.setTestRun(savedTestRun);  // Set the parent reference with the saved entity
            savedTestRun.getStages().add(stage);
        }

        // Save again with the stages
        return testRunRepository.save(savedTestRun);
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

        // Update stages individually instead of replacing the entire list
        if (testRun.getStages() != null && !testRun.getStages().isEmpty()) {
            List<TestRunStage> existingStages = existing.getStages();
            List<TestRunStage> incomingStages = testRun.getStages();

            // Update each stage by index
            for (int i = 0; i < Math.min(existingStages.size(), incomingStages.size()); i++) {
                TestRunStage existingStage = existingStages.get(i);
                TestRunStage incomingStage = incomingStages.get(i);

                // Update ElementCollections by clearing and re-adding (required for JPA)
                if (incomingStage.getSelectedOptions() != null) {
                    existingStage.getSelectedOptions().clear();
                    existingStage.getSelectedOptions().addAll(incomingStage.getSelectedOptions());
                }

                if (incomingStage.getSelectedChecklists() != null) {
                    existingStage.getSelectedChecklists().clear();
                    existingStage.getSelectedChecklists().addAll(incomingStage.getSelectedChecklists());
                }

                if (incomingStage.getStatus() != null) {
                    existingStage.setStatus(incomingStage.getStatus());
                }
            }
        }

        if (testRun.getSubmittedAt() != null) {
            existing.setSubmittedAt(testRun.getSubmittedAt());
            existing.setStatus("COMPLETED");
        }

        return testRunRepository.save(existing);
    }
}
