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
    `SELECT name 
    FROM genre, book_genre, book 
    WHERE book.id = book_genre.book_id 
      AND book_genre.genre_id = genre.id 
      AND book.id = $1;`,
    [bookid]
  );
  return rows;
}

async function getGenre(genreid) {
  const { rows } = await pool.query("SELECT * FROM genre WHERE id = $1", [
    genreid,
  ]);
  const genre = rows[0];
  console.log(genre);
  const genreBooks = await getGenreBook(genreid);
  return { genre, genreBooks };
}

async function getGenreBook(genreid) {
  const { rows } = await pool.query(
    `SELECT book.title, book.url 
    FROM book, genre, book_genre
    WHERE book.id = book_genre.book_id
    AND book_genre.genre_id = $1`,
    [genreid]
  );
  return rows;
}

async function insertNewbook(bookInfo) {
  await pool.query("");
}

module.exports = {
  getAllBooks,
  getAllAuthors,
  getAllGenres,
  getGenre,
  insertNewbook,
  getBookDetail,
};
