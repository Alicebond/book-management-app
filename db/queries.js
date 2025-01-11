const pool = require("./pool");

async function getAllBooks() {
  const { rows } = await pool.query("SELECT * FROM books");
  return rows;
}

module.exports = { getAllBooks };
