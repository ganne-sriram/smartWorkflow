CREATE SEQUENCE stage_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE stages (
    id NUMBER(19) PRIMARY KEY,
    template_id NUMBER(19) NOT NULL,
    stage_number NUMBER(10) NOT NULL,
    name VARCHAR2(100) NOT NULL,
    type VARCHAR2(50),
    description CLOB,
    CONSTRAINT fk_stage_template FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

CREATE INDEX idx_stage_template ON stages(template_id);
CREATE INDEX idx_stage_number ON stages(stage_number);

CREATE TABLE stage_available_options (
    stage_id NUMBER(19) NOT NULL,
    option_value VARCHAR2(255),
    CONSTRAINT fk_stage_options FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE CASCADE
);

CREATE TABLE stage_available_checklists (
    stage_id NUMBER(19) NOT NULL,
    checklist_value VARCHAR2(255),
    CONSTRAINT fk_stage_checklists FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE CASCADE
);
