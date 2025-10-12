package com.coreops.hub.service;

import com.coreops.hub.model.Template;
import com.coreops.hub.repository.TemplateRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class TemplateService {
    
    @Autowired
    private TemplateRepository templateRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public List<Template> getAllTemplates() {
        return templateRepository.findByStatusIn(Arrays.asList("ACTIVE", "DRAFT"));
    }
    
    public Optional<Template> getTemplateById(String id) {
        return templateRepository.findById(id);
    }
    
    public Template createTemplate(Template template, String username) {
        template.setStatus("DRAFT");
        template.setVersion(1);
        template.setCreatedBy(username);
        template.setCreatedAt(Instant.now());
        template.setUpdatedBy(username);
        template.setUpdatedAt(Instant.now());
        return templateRepository.save(template);
    }
    
    public Template updateTemplate(String id, Template template, String username) {
        Template existing = templateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Template not found"));
        
        existing.setName(template.getName());
        existing.setObjective(template.getObjective());
        existing.setStages(template.getStages());
        existing.setUpdatedBy(username);
        existing.setUpdatedAt(Instant.now());
        
        return templateRepository.save(existing);
    }
    
    public Template publishTemplate(String id, String username) {
        Template template = templateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Template not found"));
        
        if ("DRAFT".equals(template.getStatus())) {
            template.setStatus("ACTIVE");
        } else if ("ACTIVE".equals(template.getStatus())) {
            template.setVersion(template.getVersion() + 1);
        }
        
        template.setUpdatedBy(username);
        template.setUpdatedAt(Instant.now());
        
        return templateRepository.save(template);
    }
    
    public void deleteTemplate(String id) {
        templateRepository.deleteById(id);
    }
    
    public Template importTemplate(String jsonData, String username) throws Exception {
        Template template = objectMapper.readValue(jsonData, Template.class);
        template.setId(null);
        template.setStatus("DRAFT");
        template.setVersion(1);
        template.setCreatedBy(username);
        template.setCreatedAt(Instant.now());
        template.setUpdatedBy(username);
        template.setUpdatedAt(Instant.now());
        return templateRepository.save(template);
    }
    
    public String exportTemplate(String id) throws Exception {
        Template template = templateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Template not found"));
        return objectMapper.writeValueAsString(template);
    }
}
