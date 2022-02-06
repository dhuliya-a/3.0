const util = require("util");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: (req, file, callback) => {

    var buildUserDir = path.join(`${__dirname}/../${req.params.user}`);
    if (!fs.existsSync(buildUserDir)) {
      fs.mkdirSync(buildUserDir);
    }

    var buildLayersDir = path.join(`${__dirname}/..//${req.params.user}/layers`);
    if (!fs.existsSync(buildLayersDir)) {
      fs.mkdirSync(buildLayersDir);
    }

    var buildDir = path.join(`${__dirname}/../${req.params.user}/layers/${req.params.layerName}`);
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir);
    }

    callback(null, buildDir);
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg"];

    console.log(new Date(), "Rarity object sent : ", req.body.rarity, ', Original filename : ', file.originalname)

    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only accepts png/jpeg.`;
      return callback(message, null);
    }

    var filename = `${file.originalname.split(".")[0]} #${JSON.parse(req.body.rarity)[file.originalname]}.${file.originalname.split(".")[1]}`;
    callback(null, filename);
  }
});

var uploadFiles = multer({ storage: storage }).array("files");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;