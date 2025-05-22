const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

// Display detail of specific genre
exports.genreDetail = asyncHandler(async (req, res, next) => {
  const genreid = req.params.id;
  const { genre, genreBooks } = await db.getGenreDetail(genreid);
  if (genre === undefined) {
    throw new CustomNotFoundError("Genre Not Found");
  }

  res.render("genreDetail", { genre, genreBooks });
});

// *Get genre add form * //
exports.genreAddGet = asyncHandler(async (req, res, newxt) => {
  res.render("genreForm", { title: false, genre: false, errors: false });
});

// Handle genre add form on Post
exports.genreAddPost = [
  body("genre", "Genre name must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const newGenre = req.body.genre;
    const genreList = await db.getAllGenres();
    const exsitedGenre = genreList.some(
      (genre) => genre.name.toLowerCase() === newGenre.toLowerCase()
    );

    if (exsitedGenre) {
      res.render("genreForm", {
        errors: [genre, { msg: `Genre ${genre} already exsit.` }],
      });
    } else if (!errors.isEmpty()) {
      res.render("genreForm", { genre, errors: errors.array() });
    } else {
      await db.insertNewGenre(newGenre);
      res.redirect("/");
    }
  }),
];

// Display genre delete form on Get
exports.genreDeleteGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: genre delete GET");
});

// Handle genre delete form on POST
exports.genreDeletePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: genre delete POST");
});

// Display genre update form on GET
exports.genreUpdateGet = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const { genre, _ } = await db.getGenreDetail(id);

  res.render("genreForm", { genre, title: "update", errors: false });
});

// Hande genre update form on POST
exports.genreUpdatePost = [
  body("genre", "Genre name must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const id = req.params.id;
    const updatedGenre = req.body.genre;
    if (!errors.isEmpty()) {
      res.render("genreForm", {
        title: "update",
        genre,
        errors: errors.array(),
      });
    } else {
      await db.updatedGenre(updatedGenre, id);
      res.redirect(`/genre/${id}`);
    }
  }),
];
