const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

const getAllBooks = asyncHandler(async (req, res) => {
  // const books = await db.getAllBooks();
  const books = "TBD";
  res.render("index", { books });
});

module.exports = { getAllBooks };
