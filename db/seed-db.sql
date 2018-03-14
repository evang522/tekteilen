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
  description text not null,
  organization text not null
);


INSERT INTO projects (
  title, description, technologies, status, submittedby, volunteers, organization
) VALUES (
  'Volunteer System Needed',
  'We need some process or site to account for all of our volunteers',
  '{Node.js,React,MongoDB}',
  'Open',
  'Jerrly Lowfield',
  '{Evan Garrett,Charles Rowley,Sarah Kleinefrau}',
  'Louiseville Soup Kitchen'
),(
  'Assistance with Mongo Database',
  'We would like to extends our MongoDB to include a few more fields' ,
  '{MongoDB, Node.js}',
  'Open',
  'John Doe',
  '{Charles Rowley,Sarah Kleinefrau}',
  'Chosen for Life Ministries'
),
(
  'Giving history site',
  'We need a website that can store peoples giving records, but nothing we have found so far matches exactly what we need.',
  '{Java, Angular, Typescript, Javascript}',
  'Open',
  'Dietrich Hochschule',
  '{Evan Garrett,Charles Rowley,Sarah Kleinefrau}',
  'Wounded Warrior Project'
),
(
  'Church Communication system',
  'We need some process to account for all of our volunteers',
  '{Node.js,React,MongoDB}',
  'Open',
  'Jerrly Lowfield',
  '{Evan Garrett,Charles Rowley,Sarah Kleinefrau}',
  'Wilkesboro Baptist Church'
),
(
  'Volunteer System Needed',
  'We need some process to account for all of our volunteers',
  '{Node.js,React,MongoDB}',
  'Open',
  'Jerrly Lowfield',
  '{Evan Garrett,Charles Rowley,Sarah Kleinefrau}',
  'Test Charity'
),
(
  'Volunteer System Needed',
  'We need some process to account for all of our volunteers',
  '{Node.js,React,MongoDB}',
  'Open',
  'Jerrly Lowfield',
  '{Evan Garrett,Charles Rowley,Sarah Kleinefrau}',
  'Test Charity'
);



CREATE TABLE users (
  id serial PRIMARY KEY,
  fullname text not null,
  email text not null UNIQUE,
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