const express = require("express");
const router = express.Router();
const layerController = require("./controllers/layerController");
const assetController = require("./controllers/generateAssetsController");
const mintController = require("./controllers/mintController");

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
  router.post("/mint", (req, res) => {
    try {
        mintController.mintAssets(req, res);
    } catch(err) {
        console.log(err)
        res.status(500).send({"message":"Minting failed", "status":false});
    }
  });
  return app.use("/", router);
};

module.exports = routes;