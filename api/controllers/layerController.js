const upload = require("../middlewares/uploadMiddleware.js");

const layerUpload = async (req, res) => {
  try {
    
    console.log(new Date(), ': Upload Images API called');
    await upload(req, res);

    if (req.files.length <= 0) {
      console.log(new Date(), ': No files uploaded');
      return res.send(`You must select at least 1 file.`);
    }

    return res.send(`Layer uploaded`);
  } catch (error) {
    console.log(error);
    return res.send(`Error while trying to upload: ${error}`);
  }
};

module.exports = {
  layerUpload: layerUpload
};