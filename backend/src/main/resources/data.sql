-- Initial Seed Data for Smart Blood Donation Network

INSERT IGNORE INTO roles (id, name) VALUES (1, 'ROLE_ADMIN');
INSERT IGNORE INTO roles (id, name) VALUES (2, 'ROLE_DONOR');
INSERT IGNORE INTO roles (id, name) VALUES (3, 'ROLE_HOSPITAL');

-- Note: Passwords in DataInitializer will ensure BCrypt encrypted admin/donor/hospital users are available out-of-the-box.
