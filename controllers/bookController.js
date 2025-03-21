const db = require("../db/queries");
const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
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
  res.render("bookForm", { errors: false });
});

// Handle new book infomation on POST
exports.bookAddPost = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Book title must be specified."),
  body("isbn", "ISBN must not be empty.").trim().isLength({ min: 1 }),
  body("pages").trim().escape(),
  body("lang").trim().escape(),
  body("genre", "Genre name must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("firstname")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified."),
  body("lastname")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified."),
  body("date-of-birth", "Invalid date of birth.")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  body("date-of-death", "Invalid date of birth.")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("about-author").trim().escape(),
  body("overview").trim().escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const newBook = {
      title: req.body.title,
      isbn: req.body.isbn,
      pages: req.body.pages,
      language: req.body.lang,
      status: req.body.status,
      description: req.body.overview,
      genre: req.body.genre,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      dateOfBirth: req.body.dateOfBirth,
      dateOfDeath: req.body.dateOfDeath,
      aboutAuthor: req.body.aboutAuthor,
    };

    if (!errors.isEmpty()) {
      res.render("bookForm", { newBook, errors: errors.array() });
      return;
    } else {
      await db.insertNewBook(newBook);
      res.redirect("/");
    }
  }),
];

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
