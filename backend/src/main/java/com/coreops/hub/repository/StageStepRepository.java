package com.coreops.hub.repository;

import com.coreops.hub.model.StageStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StageStepRepository extends JpaRepository<StageStep, Long> {
    List<StageStep> findByStageIdOrderByStepNumberAsc(Long stageId);
}
