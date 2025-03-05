const express = require("express");
const path = require("node:path");
const indexRouter = require("./routes/index");
const bookRouter = require("./routes/bookRouter");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.use("/book", bookRouter);
app.use("/", indexRouter);

const port = process.env.PORT || 3154;
app.listen(port, () => {
  console.log(`book management app - listening on port: ${port}`);
});
