INSERT INTO users (id, username, password, email, role, enabled, created_at)
VALUES (user_seq.NEXTVAL, 'designer1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'designer1@coreops.com', 'DESIGNER', 1, SYSTIMESTAMP);

INSERT INTO users (id, username, password, email, role, enabled, created_at)
VALUES (user_seq.NEXTVAL, 'viewer1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'viewer1@coreops.com', 'VIEWER', 1, SYSTIMESTAMP);

INSERT INTO users (id, username, password, email, role, enabled, created_at)
VALUES (user_seq.NEXTVAL, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin@coreops.com', 'ADMIN', 1, SYSTIMESTAMP);
