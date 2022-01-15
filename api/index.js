const express = require("express");
const router = express.Router();
const layerController = require("./controllers/layerController");

let routes = app => {
  router.post("/layerUpload/:layerName", layerController.layerUpload);
  return app.use("/", router);
};

module.exports = routes;