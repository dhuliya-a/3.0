const upload = require("../middlewares/uploadMiddleware.js");

const multipleUpload = async (req, res) => {
  try {
    //layerName as path variable
    console.log(req.files);
    await upload(req, res);

    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file.`);
    }

    return res.send(`Layer uploaded`);
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload many files: ${error}`);
  }
};

module.exports = {
  multipleUpload: multipleUpload
};