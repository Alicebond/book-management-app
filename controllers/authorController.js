const db = require("../db/queries");
const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const entities = require("entities");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

// Display detail page for specific author
exports.authorDetail = asyncHandler(async (req, res, next) => {
  const authorid = req.params.id;
  const { author, authorBooks } = await db.getAuthorDetail(authorid);
  if (!author) throw new CustomNotFoundError("Author Not Found");

  const name = author.name;
  const description = author.description
    ? entities.decodeHTML5(author.description)
    : false;
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
    url: author.url,
  });
});

// * Get author add form * //
exports.authorAddGet = asyncHandler(async (req, res, newxt) => {
  res.render("authorForm", { title: false, authorInfo: false, errors: false });
});

// Hand author add on Post
exports.authorAddPost = [
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

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const authorInfo = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      description: req.body.aboutAuthor || null,
      dateOfBirth:
        req.body.dateOfBirth === "" ? null : new Date(req.body.dateOfBirth),
      dateOfDeath:
        req.body.dateOfDeath === "" ? null : new Date(req.body.dateOfDeath),
    };
    const authorList = await db.getAllAuthors();
    const exsitedAuthor = authorList.some(
      (author) =>
        author.name === `${authorInfo.firstname} ${authorInfo.lastname}`
    );
    if (exsitedAuthor) {
      res.render("authorForm", {
        title: false,
        authorInfo,
        errors: [
          {
            msg: `Author ${authorInfo.firstname} ${authorInfo.lastname} is already exsit.`,
          },
        ],
      });
    } else if (!errors.isEmpty()) {
      res.render("authorForm", {
        title: false,
        authorInfo,
        errors: errors.array(),
      });
    } else {
      db.insertNewAuthor(authorInfo);
      res.redirect("/");
    }
  }),
];

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
  const id = req.params.id;
  const { author, authorBooks } = await db.getAuthorDetail(id);
  if (!author) throw new CustomNotFoundError("Author Not Found");

  const authorInfo = {
    firstname: author.first_name,
    lastname: author.last_name,
    description: author.description
      ? entities.decodeHTML5(author.description)
      : false,
  };

  if (author.date_of_birth)
    authorInfo.dateOfBirth = DateTime.fromJSDate(
      author.date_of_birth
    ).toISODate();

  if (author.date_of_death)
    authorInfo.dateOfDeath = DateTime.fromJSDate(
      author.date_of_death
    ).toISODate();

  res.render("authorForm", { authorInfo, title: "update", errors: false });
});

// Handle author update form on POST
exports.authroUpdatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: author update");
});
