const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

// Display list of all authors
exports.authorList = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author list");
});

// Display detail page for specific author
exports.authorDetail = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author detail");
});

// * author add form is included  in book add form * //

// Hand author add on Post
exports.authorAddPost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author add POST");
});

// Display Author delete fomr on GET
exports.authorDeleteGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
});

// Handle author delete on POST
exports.authorDeletePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: authror delete POST");
});

// Display author update form on GET
exports.authroUpdateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: author update");
});

// Handle author update form on POST
exports.authroUpdatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: author update");
});
