const { Pool } = require("pg");
require("dotenv").config();

//////////////////////////////////
// Localhost
// module.exports = new Pool({
//   host: "localhost",
//   user: process.env.USERNAME,
//   database: "book_inventory",
//   password: process.env.PASSWORD,
//   port: 5432,
// });
///////////////////////////////////

///////////////////////////////////
// Noen Database
module.exports = new Pool({
  connectionString: process.env.DATABASE_URL,
});
//////////////////////////////////
