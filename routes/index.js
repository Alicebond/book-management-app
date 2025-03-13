const express = require("express");
const router = express.Router();

const bookController = require("../controllers/bookController");
const authorController = require("../controllers/authorController");
const genreController = require("../controllers/genreController");

/// BOOK ROUTES ///

// Get home page, show all books, genres and authors
router.get("/", bookController.bookList);

// Get request to add a new book
router.get("/book/add", bookController.bookAddGet);

// Post request to add a new book (new author, new genre)
router.post("/book/add", [
  bookController.bookAddPost,
  authorController.authorAddPost,
  genreController.genreAddPost,
]);

// Get book details
router.get("/book/:isbn", bookController.bookDetail);

// Get to update a book
router.get("/book/:isbn/update", bookController.bookUpdateGet);

// Post to update a book
router.post("/book/:isbn/update", bookController.bookUpdatePost);

// Get to delete a book
router.get("/book/:isbn/delete", bookController.bookDeleteGet);

// Post to delete a book
router.post("/book/:isbn/delete", bookController.bookDeletePost);

/// Author Routes ///

// Get author detail, delete form, update form
router.get("/author/:id", authorController.authorDetail);

// Get to update author detail
router.get("/author/:id/update", authorController.authroUpdateGet);

// Post to update author
router.post("/author/:id/update", authorController.authroUpdatePost);

// Get to delete author
router.get("/author/:id/delete");

// Post to delete author
router.post("/author/:id/delete", authorController.authorDeletePost);

/// Genre Routes ///

// Get a specific genre
router.get("/genre/:id", genreController.genreDetail);

// Get to update a genre
router.get("/genre/:id/update", genreController.genreUpdateGet);

// Post to udate a genre
router.post("/genre/:id/update", genreController.genreUpdatePost);

// Get to delete a genre
router.get("/genre/:id/delete", genreController.genreDeleteGet);

// Post to delete a genre
router.post("/genre/:id/delete", genreController.genreDeletePost);

module.exports = router;
