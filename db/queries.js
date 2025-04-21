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

async function getBookDetail(id) {
  const { rows } = await pool.query(`SELECT * FROM book WHERE id = ($1)`, [id]);

  const bookInfo = rows[0];
  const bookAuthor = await getBookAuthor(id);
  const bookGenres = await getBookGenre(id);
  return { bookInfo, bookAuthor, bookGenres };
}

async function getBookAuthor(bookid) {
  const { rows } = await pool.query(
    `SELECT * FROM author 
    INNER JOIN book_author
    ON book_author.author_id = author.id
    WHERE book_author.book_id = $1`,
    [bookid]
  );
  return rows[0];
}

async function getBookGenre(bookid) {
  const { rows } = await pool.query(
    `SELECT * FROM genre 
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
  if (bookInfo.authorid) await insertNewBookAuthor(bookInfo);
  if (bookInfo.genreid.length) await insertNewBookGenre(bookInfo);
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

async function insertNewBookAuthor(bookInfo) {
  // the pool.query return a big JS object
  // with lots of key-value pairs, the result
  // we want is assigned to a key named: rows,
  // rows is an array, there are JS objects inside
  // it, usually the first object is the result
  // of our SQL command
  const bookResult = await pool.query(
    `
      SELECT id FROM book WHERE isbn = $1`,
    [bookInfo.isbn]
  );
  const bookid = bookResult.rows[0].id;
  if (!bookid) throw new Error(`Book with title ${bookInfo.title} not found.`);

  const authorid = bookInfo.authorid;

  await pool.query(
    `INSERT INTO book_author(book_id, author_id)
    VALUES($1, $2)`,
    [bookid, authorid]
  );
}

async function insertNewBookGenre(bookInfo) {
  const bookResult = await pool.query(`SELECT id FROM book WHERE isbn = $1`, [
    bookInfo.isbn,
  ]);
  const bookid = bookResult.rows[0].id;
  if (!bookid) throw new Error(`Book "${bookInfo.title}" not found.`);
  const genreidArr = bookInfo.genreid;

  await Promise.all(
    genreidArr.map(async (genreid) => {
      await pool.query(
        `INSERT INTO book_genre (book_id, genre_id)
      VALUES ($1, $2)`,
        [bookid, genreid]
      );
    })
  );
}

async function updateBook(updatedBook, bookid) {
  const bookResult = await pool.query(`SELECT * FROM book WHERE id = $1`, [
    bookid,
  ]);
  const bookInfo = bookResult.rows[0];
  const bookAuthor = await getBookAuthor(bookid);

  const updatedBookColumns = [],
    bookValues = [];
  let index = 0;

  for (const key in updatedBook) {
    if (updatedBook[key] !== bookInfo[key]) {
      if (key === "authorid" || key === "genreid") continue;
      updatedBookColumns.push(`${key} = $${index + 1}`);
      bookValues.push(updatedBook[key]);
      index++;
    }
  }

  if (updatedBookColumns.length > 0) {
    const query = `UPDATE book SET ${updatedBookColumns.join(
      ", "
    )} WHERE id = $${index + 1}`;
    bookValues.push(bookid);

    await pool.query(query, bookValues);
  }

  if (updatedBook.genreid.length > 0) {
    /**
     * This is a database problem about managing
     * many-to-many relationship
     * Solution: Fully replace the existing genres
     * for the book with the new ones
     */
    await pool.query(`DELETE FROM book_genre WHERE book_id = $1;`, [bookid]);
    for (const genreid of updatedBook.genreid) {
      await pool.query(
        `
        INSERT INTO book_genre (book_id, genre_id) VALUES ($1, $2)
        `,
        [bookid, genreid]
      );
    }
  }

  if (
    bookAuthor === undefined ||
    String(bookAuthor.id) !== updatedBook.authorid
  ) {
    await pool.query(
      `UPDATE book_author
      SET author_id = $1
      WHERE book_id = $2`,
      [updatedBook.authorid, bookid]
    );
  }

  const { rows } = await pool.query(`SELECT * FROM book WHERE id = $1`, [
    bookid,
  ]);
  return rows[0];
}

module.exports = {
  getAllBooks,
  getAllAuthors,
  getAllGenres,
  getGenreDetail,
  getAuthorDetail,
  getBookDetail,
  insertNewGenre,
  insertNewAuthor,
  insertNewBook,
  updateBook,
};
