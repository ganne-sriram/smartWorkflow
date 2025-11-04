CREATE SEQUENCE test_run_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE test_runs (
    id NUMBER(19) PRIMARY KEY,
    template_id NUMBER(19) NOT NULL,
    template_name VARCHAR2(100) NOT NULL,
    current_stage_index NUMBER(10),
    started_at TIMESTAMP(6) WITH TIME ZONE NOT NULL,
    submitted_at TIMESTAMP(6) WITH TIME ZONE,
    user_id NUMBER(19) NOT NULL,
    status VARCHAR2(20) DEFAULT 'RUNNING' NOT NULL
);

CREATE INDEX idx_testrun_template ON test_runs(template_id);
CREATE INDEX idx_testrun_user ON test_runs(user_id);
