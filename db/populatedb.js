#! /usr/bin/env node
// This script only run once

const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE book (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255),
  ISBN VARCHAR(13),
  pages INT,
  added DATE DEFAULT NOW(),
  want_to_read BOOLEAN DEFAULT FALSE,
  reading BOOLEAN DEFAULT FALSE,
  read BOOLEAN DEFAULT FALSE,
  description TEXT,
  language TEXT,
  url TEXT,
);

CREATE TABLE author (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
  first_name VARCHAR(255),
  last_name VARCHAR(255), 
  description TEXT,
  date_of_birth DATE,
  date_of_death DATE,
  name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED
  url TEXT,
);

CREATE TABLE genre (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255),
  url TEXT,
);

CREATE TABLE book_author (
  book_id INT REFERENCES book(id) ON DELETE RESTRICT,
  author_id INT REFERENCES author(id) ON DELETE CASCADE,
  PRIMARY KEY(book_id, author_id)
);

CREATE TABLE book_genre (
  book_id INT REFERENCES book(id) ON DELETE RESTRICT,
  genre_id INT REFERENCES genre(id) ON DELETE RESTRICT, 
  PRIMARY KEY (book_id, genre_id)
);
  
INSERT INTO book (title, ISBN, pages, added, read)
VALUES ('Wonder', '9780375969027', 320, now(), TRUE);

INSERT INTO author (first_name, last_name, date_of_birth)
VALUES ('R. J.', 'Palacio', '1963-07-13');

INSERT INTO genre (name)
VALUES ('Young Adult'), 
      ('Fiction'), 
      ('Russian Literature'), 
      ('Fantasy');

INSERT INTO book_author (book_id, author_id) VALUES (1, 1);

INSERT INTO book_genre (book_id, genre_id) VALUES (1, 1);

INSERT INTO book_genre (book_id, genre_id) VALUES (1, 2);`;

async function main() {
  console.log("Seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.USERNAME}:${process.env.PASSWORD}@localhost:5432/book_inventory`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
