package com.coreops.hub.repository;

import com.coreops.hub.model.TestRun;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRunRepository extends MongoRepository<TestRun, String> {
    List<TestRun> findByTemplateId(String templateId);
    List<TestRun> findByUserId(String userId);
}
