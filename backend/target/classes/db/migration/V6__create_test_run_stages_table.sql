CREATE SEQUENCE test_run_stage_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE test_run_stages (
    id NUMBER(19) PRIMARY KEY,
    test_run_id NUMBER(19) NOT NULL,
    name VARCHAR2(100) NOT NULL,
    status VARCHAR2(20) DEFAULT 'PENDING',
    CONSTRAINT fk_testrunstage_testrun FOREIGN KEY (test_run_id) REFERENCES test_runs(id) ON DELETE CASCADE
);

CREATE TABLE test_run_stage_available_options (
    test_run_stage_id NUMBER(19) NOT NULL,
    option_value VARCHAR2(255),
    CONSTRAINT fk_trs_available_opts FOREIGN KEY (test_run_stage_id) REFERENCES test_run_stages(id) ON DELETE CASCADE
);

CREATE TABLE test_run_stage_available_checklists (
    test_run_stage_id NUMBER(19) NOT NULL,
    checklist_value VARCHAR2(255),
    CONSTRAINT fk_trs_available_chklst FOREIGN KEY (test_run_stage_id) REFERENCES test_run_stages(id) ON DELETE CASCADE
);

CREATE TABLE test_run_stage_selected_options (
    test_run_stage_id NUMBER(19) NOT NULL,
    option_value VARCHAR2(255),
    CONSTRAINT fk_trs_selected_opts FOREIGN KEY (test_run_stage_id) REFERENCES test_run_stages(id) ON DELETE CASCADE
);

CREATE TABLE test_run_stage_selected_checklists (
    test_run_stage_id NUMBER(19) NOT NULL,
    checklist_value VARCHAR2(255),
    CONSTRAINT fk_trs_selected_chklst FOREIGN KEY (test_run_stage_id) REFERENCES test_run_stages(id) ON DELETE CASCADE
);
