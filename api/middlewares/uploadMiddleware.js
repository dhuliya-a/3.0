const util = require("util");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // var pathSplit = file.originalname.split("_");
    // var dirName = pathSplit[0];
    var buildDir = path.join(`${__dirname}/../layers/${req.params.layerName}`);
    if (fs.existsSync(buildDir)) {
      fs.rmdirSync(buildDir, { recursive: true });
    }
    fs.mkdirSync(buildDir);

    callback(null, buildDir);
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only accepts png/jpeg.`;
      return callback(message, null);
    }

    // var pathSplit = file.originalname.split("_");
    // var filename = `${pathSplit[1]}`;
    var filename = `${file.originalname}`;
    callback(null, filename);
  }
});

var uploadFiles = multer({ storage: storage }).array("multi-files");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;