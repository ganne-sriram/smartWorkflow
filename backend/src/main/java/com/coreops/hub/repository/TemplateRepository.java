package com.coreops.hub.repository;

import com.coreops.hub.model.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {
    List<Template> findByStatus(String status);
    List<Template> findByStatusIn(List<String> statuses);
}
