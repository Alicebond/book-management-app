const pool = require("./pool");

async function getAllBooks() {
  const { rows } = await pool.query("SELECT title, url FROM book");
  return rows;
}

async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genre");
  return rows;
}

async function getAllAuthors() {
  const { rows } = await pool.query("SELECT * FROM author");
  return rows;
}

async function getBookDetail(isbn) {
  const { rows } = await pool.query(`SELECT * FROM book WHERE isbn = ($1)`, [
    isbn,
  ]);

  const book = rows[0];
  const author = await getBookAuthor(book.id);
  const genres = await getBookGenre(book.id);

  return { book, author, genres };
}

async function getBookAuthor(bookid) {
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

async function getBookGenre(bookid) {
  const { rows } = await pool.query(
    `SELECT genre. name FROM genre 
    INNER JOIN book_genre 
    ON book_genre.genre_id = genre.id 
    WHERE book_genre.book_id = $1`,
    [bookid]
  );
  return rows;
}

async function getGenreDetail(genreid) {
  const { rows } = await pool.query("SELECT * FROM genre WHERE id = $1", [
    genreid,
  ]);
  const genre = rows[0];
  const genreBooks = await getGenreBook(genreid);
  return { genre, genreBooks };
}

async function getGenreBook(genreid) {
  const { rows } = await pool.query(
    `SELECT book.title, book.url FROM book
    INNER JOIN book_genre 
    ON book.id = book_genre.book_id
    WHERE book_genre.genre_id = $1`,
    [genreid]
  );
  return rows;
}

async function insertNewbook(bookInfo) {
  await pool.query("");
}

async function getAuthorDetail(authorid) {
  const { rows } = await pool.query(
    `
    SELECT * FROM author
    WHERE id = $1`,
    [authorid]
  );
  const author = rows[0];
  const authorBooks = await getAuthorBooks(authorid);
  return { author, authorBooks };
}

async function getAuthorBooks(authorid) {
  const { rows } = await pool.query(
    `
    SELECT book.title, book.url
    FROM book
    INNER JOIN book_author
    ON book.id = book_author.book_id
    WHERE book_author.author_id = $1`,
    [authorid]
  );
  return rows;
}

module.exports = {
  getAllBooks,
  getAllAuthors,
  getAllGenres,
  getGenreDetail,
  getAuthorDetail,
  insertNewbook,
  getBookDetail,
};
