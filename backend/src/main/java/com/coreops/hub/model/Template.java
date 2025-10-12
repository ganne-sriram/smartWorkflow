package com.coreops.hub.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "templates")
public class Template {
    @Id
    private String id;
    
    @Indexed
    private String name;
    
    private String objective;
    
    private List<TemplateStage> stages;
    
    @Indexed
    private String status;
    
    private Integer version;
    
    private String createdBy;
    
    private Instant createdAt;
    
    private String updatedBy;
    
    private Instant updatedAt;
}
