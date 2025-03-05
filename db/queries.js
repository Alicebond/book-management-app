const pool = require("./pool");

async function getAllBooks() {
  const { rows } = await pool.query("SELECT title, url FROM book");
  return rows;
}

async function getBookDetail(isbn) {
  const { rows } = await pool.query(`SELECT * FROM book WHERE isbn = ($1)`, [
    isbn,
  ]);

  const book = rows[0];
  const author = await getAuthor(book.id);
  const genres = await getGenre(book.id);
  return { book, author, genres };
}

async function getAuthor(bookid) {
  const { rows } = await pool.query(
    `SELECT name 
    FROM author, book_author, book 
    WHERE author.id = book_author.author_id 
      AND book_author.author_id = book_author.book_id 
      AND book_author.book_id = ($1);`,
    [bookid]
  );

  return rows[0];
}

async function getGenre(bookid) {
  const { rows } = await pool.query(
    `SELECT name 
    FROM genre, book_genre, book 
    WHERE book.id = book_genre.book_id 
      AND book_genre.genre_id = genre.id 
      AND book.id = $1;`,
    [bookid]
  );
  return rows;
}

async function insertNewbook(bookInfo) {
  await pool.query("");
}

module.exports = { getAllBooks, insertNewbook, getBookDetail };
