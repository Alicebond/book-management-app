const db = require("../db/queries");
const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

//Display list of all books, genres, authors
exports.index = asyncHandler(async (req, res) => {
  const [books, genres, authors] = await Promise.all([
    db.getAllBooks(),
    db.getAllGenres(),
    db.getAllAuthors(),
  ]);
  res.render("index", { books, genres, authors });
});

// Display detail of a specific book
exports.bookDetail = asyncHandler(async (req, res) => {
  const isbn = req.params.isbn;
  const { book, author, genres } = await db.getBookDetail(isbn);
  const dateAdded = DateTime.fromJSDate(book.added).toLocaleString(
    DateTime.DATE_MED
  );

  res.render("bookDetail", { book, dateAdded, author, genres });
});

// Display form to add a new book
exports.bookAddGet = asyncHandler(async (req, res) => {
  res.render("bookForm");
});

// Handle new book infomation on POST
exports.bookAddPost = asyncHandler(async (req, res) => {
  const { title, isbn, pages } = req.body;
  // await db.insertNewbook(bookinfo);
  console.log(title, isbn, pages);
  res.redirect("/");
});

// Display book update fomr on GET
exports.bookUpdateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: book update get");
});

// Display book update fomr on GET
exports.bookUpdatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: book update post");
});

// Display book delete form on GET
exports.bookDeleteGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: book delete GET");
});

// Handle book delete form on POST
exports.bookDeletePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: book delete POST");
});
