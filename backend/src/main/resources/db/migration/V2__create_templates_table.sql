CREATE SEQUENCE template_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE templates (
    id NUMBER(19) PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    objective CLOB NOT NULL,
    status VARCHAR2(20) NOT NULL DEFAULT 'DRAFT',
    version NUMBER(10) NOT NULL DEFAULT 1,
    created_by VARCHAR2(50) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    updated_by VARCHAR2(50),
    updated_at TIMESTAMP(6)
);

CREATE INDEX idx_template_status ON templates(status);
CREATE INDEX idx_template_name ON templates(name);
