const generateAssetsHelper = require('../helpers/generateAssetsHelper');
let config = require('../configs/assetConfig');

module.exports = {
    generateAssets(req, res) {
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

        generateAssetsHelper.buildSetup(config);
        generateAssetsHelper.startCreating(config);
                
    }
}