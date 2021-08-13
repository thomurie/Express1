DROP DATABASE IF EXISTS testdb;

CREATE DATABASE testdb;

\c testdb;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    type text NOT NULL
);

INSERT INTO users
(name, type)
VALUES
('George', 'user');

INSERT INTO users
(name, type)
VALUES
('John', 'staff');

INSERT INTO users
(name, type)
VALUES
('Paul', 'admin');

INSERT INTO users
(name, type)
VALUES
('Ringote', 'user');