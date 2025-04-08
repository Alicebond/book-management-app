const db = require("../db/queries");
const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const entities = require("entities");
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
  const des = entities.decodeHTML5(book.description);
  book.description = des;

  res.render("bookDetail", { book, dateAdded, author, genres });
});

// Display form to add a new book
exports.bookAddGet = asyncHandler(async (req, res) => {
  const genres = await db.getAllGenres();
  const authors = await db.getAllAuthors();
  res.render("bookForm", {
    genres,
    authors,
    bookInfo: false,
    authorInfo: false,
    errors: false,
  });
});

// Handle new book infomation on POST
exports.bookAddPost = [
  // Convert the genre to an array
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Book title must be specified."),
  body("author", "Author must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty.").trim().isLength({ min: 1 }),
  body("pages", "Pages must be specified.").trim().escape(),
  body("lang", "Language must be specified.").trim().escape(),
  body("overview").trim().escape(),
  body("genre.*").escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const bookInfo = {
      title: req.body.title,
      isbn: req.body.isbn,
      pages: req.body.pages,
      language: req.body.lang,
      description: req.body.overview || null,
      toRead: req.body.status === "want to read",
      reading: req.body.status === "reading",
      read: req.body.status === "read",
      authorid: req.body.author,
      genreid: req.body.genre,
    };

    const bookList = await db.getAllBooks();
    const exsitedBook = bookList.some((book) => {
      book.title === bookInfo.title && book.isbn === bookInfo.isbn;
    });

    if (exsitedBook) {
      res.render("bookForm", {
        bookInfo,
        errors: [{ msg: "Book already exsits." }],
      });
      return;
    } else if (!errors.isEmpty()) {
      res.render("bookForm", {
        bookInfo,
        errors: errors.array(),
      });
      return;
    } else {
      await db.insertNewBook(bookInfo);
      res.redirect("/");
    }
  }),
];

// Display book update form on GET
exports.bookUpdateGet = asyncHandler(async (req, res, next) => {
  const isbn = req.params.isbn;
  const { bookInfo, authorInfo, genres } = await db.getBookDetail(isbn);
  const dateAdded = DateTime.fromJSDate(book.added).toLocaleString(
    DateTime.DATE_MED
  );
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
