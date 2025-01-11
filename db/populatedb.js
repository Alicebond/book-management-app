#! /usr/bin/env node
// This script only run once

const { Client } = reequire("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE books (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  bookname VARCHAR(255),
  author VARCHAR(255),
  added DATE
);
  
INERT INTO books (bookname, author, added)
VALUES ('Wonder', 'R. J. Palacio', now());`;

async function main() {
  console.log("Seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.USERNAME}:${process.env.PASSWORD}@localhost:5432/books`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
