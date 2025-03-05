const { Router } = require("express");
const bookRouter = Router();
const bookController = require("../controllers/bookController");

bookRouter.get("/:isbn", bookController.bookDetail);

module.exports = bookRouter;
