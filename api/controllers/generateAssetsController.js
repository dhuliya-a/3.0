const generateAssetsHelper = require('../helpers/generateAssetsHelper');
let config = require('../configs/assetConfig');
const fs = require('fs');
const uploadImageHelper = require('../helpers/uploadImageHelper');

module.exports = {
    async generateAssets(req, res) {
        let model = req.body;
        let user_name = model.user_name;
        let layers = model.layers;
        let pixels = model.pixel_dimensions;
        let count = model.asset_count;
        let collection_name = model.collection_name;
        let collection_description = model.collection_description;

        let layerConfig = [
            {
              growEditionSizeTo: count,
              layersOrder: [],
            },
        ];

        layersOrder = []
        layers.forEach(element => {
            layersOrder.push({"name":element});
        });
        layerConfig[0].layersOrder = layersOrder;
        config.layerConfigurations = layerConfig;
        config.namePrefix = collection_name;
        config.description = collection_description;
        config.format.height = pixels[0];
        config.format.width = pixels[1];

        generateAssetsHelper.buildSetup(config, user_name);
        let generated_count =  await generateAssetsHelper.startCreating(config, user_name);

        // get image URLs
        let imageURLs = await uploadImageHelper.uploadImageToIPFS(user_name);

        // Delete the layers
        let buildDirLayers = `${process.cwd()}/${user_name}/layers`
        if (fs.existsSync(buildDirLayers)) {
            fs.rmdirSync(buildDirLayers, { recursive: true });
        }

        // Delete the generated images
        let buildDirImages = `${process.cwd()}/${user_name}/build/images`
        if (fs.existsSync(buildDirImages)) {
            fs.rmdirSync(buildDirImages, { recursive: true });
        }

        res.send({"image_count":generated_count-1, "image_url":imageURLs})
        res.end();
                
    }
}