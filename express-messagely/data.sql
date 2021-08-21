DROP DATABASE IF EXISTS messagely;

CREATE DATABASE messagely;

\c messagely;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users,
    to_username text NOT NULL REFERENCES users,
    body text NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    read_at timestamp with time zone
);


SELECT a.hacker_id, a.name, COUNT(b.challenge_id) 
FROM hackers AS a 
JOIN challenges AS b 
ON a.hacker_id = b.hacker_id 
GROUP BY a.hacker_id, a.name 
HAVING COUNT(b.challenge_id) =(SELECT MAX(y.num)
  FROM (SELECT COUNT(f.challenge_id) AS num
          FROM hackers AS e 
            JOIN challenges AS f 
            ON e.hacker_id = f.hacker_id 
            GROUP BY e.hacker_id, e.name ) y )
ORDER BY COUNT(b.challenge_id) DESC, a.hacker_id;