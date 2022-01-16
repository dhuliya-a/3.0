const express = require("express");
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()
const initRoutes = require("./routes.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

initRoutes(app);

app.listen(process.env.PORT, () => {
  console.log(`Running at localhost:${process.env.PORT}`);
});