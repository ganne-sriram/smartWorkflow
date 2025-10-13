CREATE SEQUENCE stage_step_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE stage_steps (
    id NUMBER(19) PRIMARY KEY,
    stage_id NUMBER(19) NOT NULL,
    step_number NUMBER(10) NOT NULL,
    name VARCHAR2(100) NOT NULL,
    description CLOB,
    step_type VARCHAR2(50),
    required NUMBER(1) DEFAULT 0 NOT NULL,
    configuration CLOB,
    CONSTRAINT fk_step_stage FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE CASCADE,
    CONSTRAINT chk_step_required CHECK (required IN (0, 1))
);

CREATE INDEX idx_step_stage ON stage_steps(stage_id);
CREATE INDEX idx_step_number ON stage_steps(step_number);
