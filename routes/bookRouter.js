const { Router } = require("express");
const bookRouter = Router();
const bookController = require("../controllers/bookController");

bookRouter.get("/add", bookController.createBookGet);
bookRouter.get("/:isbn", bookController.bookDetail);

module.exports = bookRouter;
