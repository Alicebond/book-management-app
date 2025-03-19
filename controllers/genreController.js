const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
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

// * genre add form is included  in book add form * //

// Handle genre add form on Post
exports.genreAddPost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: genre add Post");
});

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
  res.send("NOT IMPLEMENTED: genre update GET");
});

// Hande genre update form on POST
exports.genreUpdatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: genre update POST");
});
