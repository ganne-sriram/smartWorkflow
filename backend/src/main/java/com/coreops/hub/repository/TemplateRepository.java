package com.coreops.hub.repository;

import com.coreops.hub.model.Template;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemplateRepository extends MongoRepository<Template, String> {
    List<Template> findByStatus(String status);
    List<Template> findByStatusIn(List<String> statuses);
}
