package com.coreops.hub.repository;

import com.coreops.hub.model.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {
    List<Template> findByStatus(String status);

    @Query("SELECT DISTINCT t FROM Template t LEFT JOIN FETCH t.stages WHERE t.status IN :statuses")
    List<Template> findByStatusIn(@Param("statuses") List<String> statuses);

    @Query("SELECT t FROM Template t LEFT JOIN FETCH t.stages WHERE t.id = :id")
    Optional<Template> findByIdWithStages(@Param("id") Long id);
}
