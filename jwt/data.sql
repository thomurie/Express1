DROP DATABASE IF EXISTS jwtdb;

CREATE DATABASE jwtdb;

\c jwtdb;

CREATE TABLE users
(
    username TEXT NOT NULL PRIMARY KEY,
    password TEXT NOT NULL
);