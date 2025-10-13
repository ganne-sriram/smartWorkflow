package com.coreops.hub.service;

import com.coreops.hub.model.Template;
import com.coreops.hub.repository.TemplateRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TemplateService {
    
    @Autowired
    private TemplateRepository templateRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public List<Template> getAllTemplates() {
        return templateRepository.findByStatusIn(Arrays.asList("ACTIVE", "DRAFT"));
    }
    
    public Optional<Template> getTemplateById(Long id) {
        return templateRepository.findById(id);
    }
    
    public Template createTemplate(Template template, String username) {
        template.setStatus("DRAFT");
        template.setVersion(1);
        return templateRepository.save(template);
    }
    
    public Template updateTemplate(Long id, Template template, String username) {
        Template existing = templateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Template not found"));
        
        existing.setName(template.getName());
        existing.setObjective(template.getObjective());
        existing.setStages(template.getStages());
        
        return templateRepository.save(existing);
    }
    
    public Template publishTemplate(Long id, String username) {
        Template template = templateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Template not found"));
        
        if ("DRAFT".equals(template.getStatus())) {
            template.setStatus("ACTIVE");
        } else if ("ACTIVE".equals(template.getStatus())) {
            template.setVersion(template.getVersion() + 1);
        }
        
        return templateRepository.save(template);
    }
    
    public void deleteTemplate(Long id) {
        templateRepository.deleteById(id);
    }
    
    public Template importTemplate(String jsonData, String username) throws Exception {
        Template template = objectMapper.readValue(jsonData, Template.class);
        template.setId(null);
        template.setStatus("DRAFT");
        template.setVersion(1);
        return templateRepository.save(template);
    }
    
    public String exportTemplate(Long id) throws Exception {
        Template template = templateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Template not found"));
        return objectMapper.writeValueAsString(template);
    }
}
