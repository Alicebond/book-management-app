const db = require("../db/queries");
const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

// Display detail page for specific author
exports.authorDetail = asyncHandler(async (req, res, next) => {
  const authorid = req.params.id;
  const { author, authorBooks } = await db.getAuthorDetail(authorid);
  if (!author) throw new CustomNotFoundError("Author Not Found");

  const name = author.name;
  const description = author.description || "";
  let dateOfBirth = undefined;
  let dateOfDeath = undefined;
  if (author.date_of_birth)
    dateOfBirth = DateTime.fromJSDate(author.date_of_birth).toLocaleString(
      DateTime.DATE_MED
    );

  if (author.date_of_death)
    dateOfDeath = DateTime.fromJSDate(author.date_of_death).toLocaleString(
      DateTime.DATE_MED
    );

  res.render("authorDetail", {
    name,
    description,
    dateOfBirth,
    dateOfDeath,
    authorBooks,
  });
});

// * author add form is included  in book add form * //

// Hand author add on Post
exports.authorAddPost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author detail");
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
