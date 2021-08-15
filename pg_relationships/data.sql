DROP DATABASE IF EXISTS ng_rel;

CREATE DATABASE ng_rel;

\c ng_rel;

DROP TABLE IF EXISTS users
CASCADE;
DROP TABLE IF EXISTS messages
CASCADE;
DROP TABLE IF EXISTS tags
CASCADE;
DROP TABLE IF EXISTS messages_tags
CASCADE;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL
);

CREATE TABLE messages
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users,
    msg TEXT NOT NULL
);

CREATE TABLE tags
(
    code TEXT PRIMARY KEY,
    tag TEXT UNIQUE
);

CREATE TABLE messages_tags
(
    message_id INTEGER NOT NULL REFERENCES messages,
    tag_code TEXT NOT NULL REFERENCES tags,
    PRIMARY KEY(message_id, tag_code)
);

INSERT INTO users (name, type) 
VALUES 
('Paul', 'admin'), 
('John', 'user'), 
('George', 'user'), 
('Ringo', 'staff');

INSERT INTO messages(user_id, msg) 
VALUES 
(1, 'Lucy in the sky with diamonds'), 
(2, 'Paperback Writer'), 
(3, 'She is a day tripper'), 
(4, 'Blackbird singing in the dead of night');

INSERT INTO tags
VALUES
('one', 'Number One Hits'),
('acoustic', 'John and George Unplugged'),
('odd', 'Enjoy the psycadelia');

