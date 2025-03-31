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
    `SELECT author.name, author.url 
    FROM author INNER JOIN book_author
    ON book_author.author_id = author.id
    WHERE book_author.book_id = $1`,
    [bookid]
  );

  return rows[0];
}

async function getBookGenre(bookid) {
  const { rows } = await pool.query(
    `SELECT genre.name, genre.url FROM genre 
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

async function addNewBook(bookInfo, authorInfo, genreInfo) {
  const bookList = await getAllBooks();
  const authorList = await getAllAuthors();
  const genreList = await getAllGenres();

  const exsitedBook = bookList.some((book) => book.title === bookInfo.title);
  const exsitedAuthor = authorList.some(
    (author) => author.name === `${authorInfo.firstname} ${authorInfo.lastname}`
  );
  const exsitedGenre = genreList.some(
    (genre) => genre.name.toLowerCase() === genreInfo.toLowerCase()
  );

  if (!exsitedBook) await insertNewBook(bookInfo);
  if (!exsitedAuthor) await insertNewAuthor(authorInfo);
  if (!exsitedGenre) await insertNewGenre(genreInfo);
  await insetNewBookAuthor(
    bookInfo.title,
    authorInfo.firstname,
    authorInfo.lastname
  );
  await insetNewBookGenre(bookInfo.title, genreInfo);
}

async function insertNewBook(bookInfo) {
  await pool.query(
    `
    INSERT INTO book(
    title, isbn, pages, reading, read, want_to_read, description, language)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
      bookInfo.title,
      bookInfo.isbn,
      bookInfo.pages,
      bookInfo.reading,
      bookInfo.read,
      bookInfo.toRead,
      bookInfo.description,
      bookInfo.language,
    ]
  );
}

async function insertNewAuthor(authorInfo) {
  await pool.query(
    `
    INSERT INTO author(
    first_name, last_name, description, date_of_birth, date_of_death)
    VALUES($1, $2, $3, $4, $5)`,
    [
      authorInfo.firstname,
      authorInfo.lastname,
      authorInfo.description,
      authorInfo.dateOfBirth,
      authorInfo.dateOfDeath,
    ]
  );
}

async function insertNewGenre(newGenre) {
  await pool.query(
    `
    INSERT INTO genre(name)
    VALUES($1)`,
    [newGenre]
  );
}

async function insetNewBookAuthor(title, firstname, lastname) {
  const bookResult = await pool.query(
    `
      SELECT id FROM book WHERE title = $1`,
    [title]
  );
  const bookid = bookResult.rows[0].id;
  if (!bookid) throw new Error(`Book with title ${title} not found.`);

  const authorResult = await pool.query(
    `SELECT id FROM author WHERE first_name = $1 and last_name = $2`,
    [firstname, lastname]
  );
  const authorid = authorResult.rows[0].id;
  if (!authorid)
    throw new Error(`Author "${firstname} ${lastname}" not found.`);

  await pool.query(
    `INSERT INTO book_author(book_id, author_id)
    VALUES($1, $2)`,
    [bookid, authorid]
  );
}

async function insetNewBookGenre(title, genre) {
  const bookResult = await pool.query(
    `
      SELECT id FROM book WHERE title = $1`,
    [title]
  );
  const genreResult = await pool.query(`SELECT id FROM genre WHERE name = $1`, [
    genre,
  ]);
  console.log(bookResult, genreResult);
  const bookid = bookResult.rows[0].id;
  if (!bookid) throw new Error(`Book "${title}" not found.`);

  const genreid = genreResult.rows[0].id;
  if (!genreid) throw new Error();

  await pool.query(
    `INSERT INTO book_genre (book_id, genre_id)
    VALUES ($1, $2)`,
    [bookid, genreid]
  );
}

module.exports = {
  getAllBooks,
  getAllAuthors,
  getAllGenres,
  getGenreDetail,
  getAuthorDetail,
  addNewBook,
  getBookDetail,
};
