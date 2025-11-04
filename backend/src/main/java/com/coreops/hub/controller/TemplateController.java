package com.coreops.hub.controller;

import com.coreops.hub.dto.ImportRequest;
import com.coreops.hub.model.Template;
import com.coreops.hub.service.TemplateService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {
    
    private static final Logger logger = LoggerFactory.getLogger(TemplateController.class);
    
    @Autowired
    private TemplateService templateService;
    
    @GetMapping
    public ResponseEntity<List<Template>> getAllTemplates() {
        logger.info("GET /api/templates - Fetching all templates");
        List<Template> templates = templateService.getAllTemplates();
        logger.info("GET /api/templates - Returning {} templates", templates.size());
        return ResponseEntity.ok(templates);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Template> getTemplateById(@PathVariable Long id) {
        logger.info("GET /api/templates/{} - Fetching template", id);
        return templateService.getTemplateById(id)
            .map(template -> {
                logger.info("GET /api/templates/{} - Template found: {}", id, template.getName());
                return ResponseEntity.ok(template);
            })
            .orElseGet(() -> {
                logger.warn("GET /api/templates/{} - Template not found", id);
                return ResponseEntity.notFound().build();
            });
    }
    
    @PostMapping
    @PreAuthorize("hasRole('DESIGNER')")
    public ResponseEntity<Template> createTemplate(@Valid @RequestBody Template template, Authentication auth) {
        String username = auth.getName();
        logger.info("POST /api/templates - Creating template '{}' by user '{}'", template.getName(), username);
        logger.debug("POST /api/templates - Template data: name={}, objective={}, stages count={}", 
            template.getName(), 
            template.getObjective(), 
            template.getStageDTOs() != null ? template.getStageDTOs().size() : 0);
        
        try {
            Template created = templateService.createTemplate(template, username);
            logger.info("POST /api/templates - Template created successfully with id={}", created.getId());
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            logger.error("POST /api/templates - Error creating template: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DESIGNER')")
    public ResponseEntity<Template> updateTemplate(@PathVariable Long id, @Valid @RequestBody Template template, Authentication auth) {
        String username = auth.getName();
        logger.info("PUT /api/templates/{} - Updating template by user '{}'", id, username);
        logger.debug("PUT /api/templates/{} - Template data: name={}, objective={}, stages count={}", 
            id,
            template.getName(), 
            template.getObjective(), 
            template.getStageDTOs() != null ? template.getStageDTOs().size() : 0);
        
        try {
            Template updated = templateService.updateTemplate(id, template, username);
            logger.info("PUT /api/templates/{} - Template updated successfully", id);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("PUT /api/templates/{} - Error updating template: {}", id, e.getMessage(), e);
            throw e;
        }
    }
    
    @PostMapping("/{id}/publish")
    @PreAuthorize("hasRole('DESIGNER')")
    public ResponseEntity<Template> publishTemplate(@PathVariable Long id, Authentication auth) {
        String username = auth.getName();
        logger.info("POST /api/templates/{}/publish - Publishing template by user '{}'", id, username);
        try {
            Template published = templateService.publishTemplate(id, username);
            logger.info("POST /api/templates/{}/publish - Template published successfully", id);
            return ResponseEntity.ok(published);
        } catch (Exception e) {
            logger.error("POST /api/templates/{}/publish - Error publishing template: {}", id, e.getMessage(), e);
            throw e;
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DESIGNER')")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        logger.info("DELETE /api/templates/{} - Deleting template", id);
        try {
            templateService.deleteTemplate(id);
            logger.info("DELETE /api/templates/{} - Template deleted successfully", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("DELETE /api/templates/{} - Error deleting template: {}", id, e.getMessage(), e);
            throw e;
        }
    }
    
    @PostMapping("/import")
    @PreAuthorize("hasRole('DESIGNER')")
    public ResponseEntity<?> importTemplate(@RequestBody ImportRequest request, Authentication auth) {
        String username = auth.getName();
        logger.info("POST /api/templates/import - Importing template by user '{}'", username);
        try {
            Template template = templateService.importTemplate(request.getData(), username);
            logger.info("POST /api/templates/import - Template imported successfully with id={}", template.getId());
            return ResponseEntity.ok(template);
        } catch (Exception e) {
            logger.error("POST /api/templates/import - Error importing template: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Failed to import template: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}/export")
    public ResponseEntity<?> exportTemplate(@PathVariable Long id) {
        logger.info("GET /api/templates/{}/export - Exporting template", id);
        try {
            String json = templateService.exportTemplate(id);
            logger.info("GET /api/templates/{}/export - Template exported successfully", id);
            return ResponseEntity.ok(json);
        } catch (Exception e) {
            logger.error("GET /api/templates/{}/export - Error exporting template: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body("Failed to export template: " + e.getMessage());
        }
    }
}
