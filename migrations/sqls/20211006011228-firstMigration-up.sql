-- BEGINNING FIRST MIGRATION

CREATE SCHEMA IF NOT EXISTS business;

CREATE TABLE IF NOT EXISTS business.user(
  user_id SERIAL,
  name TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  phone TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'C',
  active boolean DEFAULT true,
  PRIMARY KEY("user_id")
);

CREATE TABLE IF NOT EXISTS business.ticket(
  ticket_id SERIAL,
  create_at TIMESTAMP DEFAULT now(),
  user_id int4 NOT NULL,
  description TEXT NOT NULL,
  file_path TEXT,
  attention int4 DEFAULT null,
  solved boolean DEFAULT false,
  active boolean DEFAULT true,
  PRIMARY KEY("ticket_id")
);

ALTER TABLE business.ticket ADD FOREIGN KEY (user_id) REFERENCES business.user(user_id);
ALTER TABLE business.ticket ADD FOREIGN KEY (attention) REFERENCES business.user(user_id);

CREATE TABLE IF NOT EXISTS business.comment(
  comment_id SERIAL,
  ticket_id int4 NOT NULL,
  create_at TIMESTAMP DEFAULT now(),
  user_id int4 NOT NULL,
  comment TEXT NOT NULL,
  file_path TEXT,
  PRIMARY KEY("comment_id")
);

ALTER TABLE business.comment ADD FOREIGN KEY (ticket_id) REFERENCES business.ticket(ticket_id);
ALTER TABLE business.comment ADD FOREIGN KEY (user_id) REFERENCES business.user(user_id);