const express = require("express");
const router = express.Router();
const layerController = require("./controllers/layerController");
const assetController = require("./controllers/generateAssetsController");

let routes = app => {
  router.post("/layerUpload/:user/layer/:layerName", layerController.layerUpload);
  router.post("/generateAssets", (req, res) => {
    try {
        assetController.generateAssets(req, res);
    } catch(err) {
        console.log(err)
        res.status(500).send({"data":[], "status":false});
    }
  });
  return app.use("/", router);
};

module.exports = routes;