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
  const id = req.params.id;
  const { bookInfo, bookAuthor, bookGenres } = await db.getBookDetail(id);
  const dateAdded = DateTime.fromJSDate(bookInfo.added).toLocaleString(
    DateTime.DATE_MED
  );
  bookInfo.description = bookInfo.description
    ? entities.decodeHTML5(bookInfo.description)
    : false;

  res.render("bookDetail", { bookInfo, dateAdded, bookAuthor, bookGenres });
});

// Display form to add a new book
exports.bookAddGet = asyncHandler(async (req, res) => {
  const genres = await db.getAllGenres();
  const authors = await db.getAllAuthors();
  res.render("bookForm", {
    title: false,
    genres,
    authors,
    bookInfo: false,
    bookAuthor: false,
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
        title: false,
        bookInfo,
        errors: [{ msg: "Book already exsits." }],
      });
      return;
    } else if (!errors.isEmpty()) {
      res.render("bookForm", {
        title: false,
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
  const id = req.params.id;
  const { bookInfo, bookAuthor, bookGenres } = await db.getBookDetail(id);

  const authors = await db.getAllAuthors();
  const genres = await db.getAllGenres();
  const bookGenresId = bookGenres.map((genre) => genre.id);

  bookInfo.description = bookInfo.description
    ? entities.decodeHTML5(bookInfo.description)
    : false;

  genres.forEach((genre) => {
    if (bookGenresId.includes(genre.id)) genre.checked = true;
  });

  res.render("bookForm", {
    title: "update",
    bookInfo,
    bookAuthor,
    genres,
    authors,
    errors: false,
  });
});

// Handle book update form on Post
exports.bookUpdatePost = [
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

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    const updatedBook = {
      title: req.body.title,
      isbn: req.body.isbn,
      pages: req.body.pages,
      language: req.body.lang,
      description: req.body.overview || null,
      want_to_read: req.body.status === "want to read",
      reading: req.body.status === "reading",
      read: req.body.status === "read",
      authorid: req.body.author,
      genreid: req.body.genre,
    };

    const id = req.params.id;
    const { bookInfo, bookAuthor, bookGenres } = await db.getBookDetail(id);

    const authors = await db.getAllAuthors();
    const genres = await db.getAllGenres();
    const bookGenresId = bookGenres.map((genre) => genre.id);

    genres.forEach((genre) => {
      if (bookGenresId.includes(genre.id)) genre.checked = true;
    });

    updatedBook.description = updatedBook.description
      ? entities.decodeHTML5(updatedBook.description)
      : false;

    if (!errors.isEmpty()) {
      res.render("bookForm", {
        title: "update",
        bookInfo: updatedBook,
        bookAuthor,
        genres,
        authors,
        errors: errors.array(),
      });
      return;
    } else {
      const book = await db.updateBook(updatedBook, id);
      res.redirect(`${book.url}`);
    }
  }),
];

// Display book delete form on GET
exports.bookDeleteGet = asyncHandler(async (req, res, next) => {
  const { bookInfo, bookAuthor, bookGenres } = await db.getBookDetail(
    req.params.id
  );

  if (bookInfo === null) {
    res.redirect("/");
  }

  res.render("bookDelete", {
    title: "Delete Book",
    bookInfo,
    bookAuthor,
    bookGenres,
  });
});

// Handle book delete form on POST
exports.bookDeletePost = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  await db.deleteBook(id);
  res.redirect("/");
});
