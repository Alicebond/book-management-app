const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

//Display list of all books, genres, authors
exports.bookList = asyncHandler(async (req, res) => {
  const books = await db.getAllBooks();
  const genres = await db.getAllGenres();
  const authors = await db.getAllAuthors();
  res.render("index", { books, genres, authors });
});

// Display detail of a specific book
exports.bookDetail = asyncHandler(async (req, res) => {
  const isbn = req.params.isbn;
  const { book, author, genres } = await db.getBookDetail(isbn);
  res.render("bookDetail", { book, author, genres });
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
