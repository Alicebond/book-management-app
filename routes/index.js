const { Router } = require("express");
const indexRouter = Router();

const bookController = require("../controllers/bookController");

indexRouter.get("/", bookController.getAllBooks);

module.exports = indexRouter;
