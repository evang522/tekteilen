DROP TABLE if exists users;
DROP TABLE if exists projects;

DROP TYPE  IF EXISTS projectstatus;
CREATE TYPE projectstatus AS ENUM ('Open', 'Closed');

CREATE TABLE projects (
  title text not null,
  id serial PRIMARY KEY,
  technologies text[],
  discussion json,
  created timestamp DEFAULT current_timestamp,
  status projectstatus,
  submittedby text,
  -- TODO need to reference user IDs
  volunteers text[],
  neededby timestamp,
  description text not null
);


INSERT INTO projects (
  title, description
) VALUES (
  'Volunteer System Needed',
  'We need some process to account for all of our volunteers'
);



CREATE TABLE users (
  id serial PRIMARY KEY,
  fullname text not null,
  email text not null,
  created timestamp DEFAULT current_timestamp,
  merit int DEFAULT 5,
  isAdmin boolean DEFAULT false,
  phone text,
  password text not null
);


INSERT INTO users (
  fullname, email, phone, password
) VALUES (
  'Jodi Garrett', 'jodijean8@gmail.com', '912 661 8269', 'mypass'
);