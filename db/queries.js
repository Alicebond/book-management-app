const pool = require("./pool");

async function getAllBooks() {
  const { rows } = await pool.query("SELECT * FROM book");
  return rows;
}

module.exports = { getAllBooks };
