DROP TABLE  users, projects, comments CASCADE;
DROP TABLE if exists projects;

DROP TYPE  IF EXISTS projectstatus;
CREATE TYPE projectstatus AS ENUM ('Open', 'Closed');




CREATE TABLE users (
  id serial PRIMARY KEY,
  fullname text not null,
  email text not null UNIQUE,
  created timestamp DEFAULT current_timestamp,
  merit int DEFAULT 5,
  isAdmin boolean DEFAULT false,
  phone text,
  password text not null,
  technologies text[]
);


INSERT INTO users (
  fullname, email, phone, password, technologies
) VALUES 
  ('Evan Garrett', 'evang522@gmail.com', '912 623 8269', '$2a$10$3aVibx1rIxCViPLSgcPDheEZB86ou0jJZAmUIFTocbvOPnhcb.Jkm', '{Node.js, MongoDB, React}'),
  ('Jodi Garrett', 'jodijean8gmail.com', '912 233 8256', '$2a$10$3aVibx1rIxCViPLSgcPDheEZB86ou0jJZAmUIFTocbvOPnhcb.Jkm', '{CSS, Design, Wireframing, Photoshop, Lightroom}'),
  ('George Washington', 'gwashington@federal.us.important.topsecret.gov', '222 222 1222', '$2a$10$3aVibx1rIxCViPLSgcPDheEZB86ou0jJZAmUIFTocbvOPnhcb.Jkm', '{Presidenting, Canoeing, Leading Rebellions}'),
  ('Jimmy Neutron', 'jneutron@science.ed', '212 223 2269', '$2a$10$3aVibx1rIxCViPLSgcPDheEZB86ou0jJZAmUIFTocbvOPnhcb.Jkm', '{C++, Java, Mechanical Software}');


CREATE TABLE projects (
  title text not null,
  id serial PRIMARY KEY,
  technologies text[],
  discussion json,
  created timestamp DEFAULT current_timestamp,
  status projectstatus,
  submittedby text,
  -- TODO need to reference user IDs
  volunteers int[],
  neededby text,
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
  '{1}',
  'Louiseville Soup Kitchen'
),(
  'Assistance with Mongo Database',
  'We would like to extends our MongoDB to include a few more fields' ,
  '{MongoDB, Node.js}',
  'Open',
  'John Doe',
  '{2}',
  'Chosen for Life Ministries'
),
(
  'Giving history site',
  'We need a website that can store peoples giving records, but nothing we have found so far matches exactly what we need.',
  '{Java, Angular, Typescript, Javascript}',
  'Open',
  'Dietrich Hochschule',
  '{1,2,3,4}',
  'Wounded Warrior Project'
),
(
  'Church Communication system',
  'We need some process to account for all of our volunteers',
  '{Node.js,React,MongoDB}',
  'Open',
  'Jerrly Lowfield',
  '{2,3}',
  'Wilkesboro Baptist Church'
),
(
  'Volunteer System Needed',
  'We need some process to account for all of our volunteers',
  '{Node.js,React,MongoDB}',
  'Open',
  'Jerrly Lowfield',
  '{1,2,3}',
  'Test Charity'
),
(
  'Volunteer System Needed',
  'We need some process to account for all of our volunteers',
  '{Node.js,React,MongoDB}',
  'Open',
  'Jerrly Lowfield',
  '{4,1}',
  'Test Charity'
);


CREATE TABLE comments (
  id serial PRIMARY KEY,
  date timestamp DEFAULT current_timestamp,
  archived boolean DEFAULT false,
  edited boolean DEFAULT false,
  user_id integer REFERENCES users ON DELETE SET NULL,
  project_id integer REFERENCES projects ON DELETE SET NULL,
  message text NOT NULL
);


INSERT INTO comments (
  user_id, project_id, message
) VALUES (
  1,1, 'Hello!'
);