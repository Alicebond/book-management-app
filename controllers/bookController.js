const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

const getAllBooks = asyncHandler(async (req, res) => {
  const books = await db.getAllBooks();
  res.render("index", { books });
});

const bookDetail = asyncHandler(async (req, res) => {
  const isbn = req.params.isbn;
  const { book, author, genres } = await db.getBookDetail(isbn);
  res.render("bookDetail", { book, author, genres });
});

const createBookGet = asyncHandler(async (req, res) => {
  res.render("bookForm");
});

const createBookPost = asyncHandler(async (req, res) => {
  const { bookinfo } = req.body;
  await db.insertNewbook(bookinfo);
  res.redirect("/");
});

module.exports = { getAllBooks, createBookGet, createBookPost, bookDetail };
