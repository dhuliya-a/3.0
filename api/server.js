const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config()
const initRoutes = require("./routes.js");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

app.listen(process.env.PORT, () => {
  console.log(`Running at localhost:${process.env.PORT}`);
});