package com.coreops.hub.controller;

import com.coreops.hub.dto.ImportRequest;
import com.coreops.hub.model.Template;
import com.coreops.hub.service.TemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {
    
    @Autowired
    private TemplateService templateService;
    
    @GetMapping
    public ResponseEntity<List<Template>> getAllTemplates() {
        return ResponseEntity.ok(templateService.getAllTemplates());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Template> getTemplateById(@PathVariable String id) {
        return templateService.getTemplateById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @PreAuthorize("hasRole('DESIGNER')")
    public ResponseEntity<Template> createTemplate(@RequestBody Template template, Authentication auth) {
        String username = auth.getName();
        return ResponseEntity.ok(templateService.createTemplate(template, username));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DESIGNER')")
    public ResponseEntity<Template> updateTemplate(@PathVariable String id, @RequestBody Template template, Authentication auth) {
        String username = auth.getName();
        return ResponseEntity.ok(templateService.updateTemplate(id, template, username));
    }
    
    @PostMapping("/{id}/publish")
    @PreAuthorize("hasRole('DESIGNER')")
    public ResponseEntity<Template> publishTemplate(@PathVariable String id, Authentication auth) {
        String username = auth.getName();
        return ResponseEntity.ok(templateService.publishTemplate(id, username));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DESIGNER')")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/import")
    @PreAuthorize("hasRole('DESIGNER')")
    public ResponseEntity<?> importTemplate(@RequestBody ImportRequest request, Authentication auth) {
        try {
            String username = auth.getName();
            Template template = templateService.importTemplate(request.getData(), username);
            return ResponseEntity.ok(template);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to import template: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}/export")
    public ResponseEntity<?> exportTemplate(@PathVariable String id) {
        try {
            String json = templateService.exportTemplate(id);
            return ResponseEntity.ok(json);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to export template: " + e.getMessage());
        }
    }
}
