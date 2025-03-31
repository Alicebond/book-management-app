const express = require("express");
const path = require("node:path");
const router = require("./routes/index");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// Parse form data into req.body
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err);
});

const port = process.env.PORT || 3154;
app.listen(port, () => {
  console.log(`book management app - listening on port: ${port}`);
});
