const { Router } = require("express");
const indexRouter = Router();
const { getAllBooks } = require("../controllers/bookController");

indexRouter.get("/", getAllBooks);

module.exports = indexRouter;
