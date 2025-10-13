package com.coreops.hub.repository;

import com.coreops.hub.model.TestRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRunRepository extends JpaRepository<TestRun, Long> {
    List<TestRun> findByTemplateId(Long templateId);
    List<TestRun> findByUserId(Long userId);
}
