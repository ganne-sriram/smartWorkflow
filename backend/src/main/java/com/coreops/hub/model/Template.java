package com.coreops.hub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "templates", indexes = {
    @Index(name = "idx_template_status", columnList = "status"),
    @Index(name = "idx_template_name", columnList = "name")
})
@EntityListeners(AuditingEntityListener.class)
public class Template {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "template_seq")
    @SequenceGenerator(name = "template_seq", sequenceName = "template_seq", allocationSize = 1)
    private Long id;
    
    @NotBlank(message = "Template name is required")
    @Size(min = 3, max = 100)
    @Column(nullable = false, length = 100)
    private String name;
    
    @NotBlank(message = "Objective is required")
    @Column(nullable = false, columnDefinition = "CLOB")
    private String objective;
    
    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Stage> stages = new ArrayList<>();
    
    @Transient
    private List<TemplateStage> stageDTOs = new ArrayList<>();
    
    @Column(nullable = false, length = 20)
    private String status = "DRAFT";
    
    @Column(nullable = false)
    private Integer version = 1;
    
    @CreatedBy
    @Column(nullable = false, updatable = false, length = 50)
    private String createdBy;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    
    @LastModifiedBy
    @Column(length = 50)
    private String updatedBy;
    
    @LastModifiedDate
    private Instant updatedAt;
    
    public void addStage(Stage stage) {
        stages.add(stage);
        stage.setTemplate(this);
    }
    
    public void removeStage(Stage stage) {
        stages.remove(stage);
        stage.setTemplate(null);
    }
    
    @JsonProperty("stages")
    public List<TemplateStage> getStageDTOs() {
        if (stageDTOs == null || stageDTOs.isEmpty()) {
            return stages.stream()
                .map(stage -> {
                    TemplateStage dto = new TemplateStage();
                    dto.setName(stage.getName());
                    dto.setAvailableOptions(stage.getAvailableOptions());
                    dto.setAvailableChecklists(stage.getAvailableChecklists());
                    return dto;
                })
                .collect(Collectors.toList());
        }
        return stageDTOs;
    }
    
    @JsonProperty("stages")
    public void setStageDTOs(List<TemplateStage> stageDTOs) {
        this.stageDTOs = stageDTOs;
    }
}
