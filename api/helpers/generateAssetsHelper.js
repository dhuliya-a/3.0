const basePath = process.cwd();
const { NETWORK } = require(`../constants/network`);
const fs = require("fs");
const { config } = require("dotenv");
const sha1 = require('sha1');
const { createCanvas, loadImage } = require('canvas');
var buildDir = `${basePath}/build`;
var layersDir = `${basePath}/layers`;

var metadataList = [];
var attributesList = [];
var dnaList = new Set();
const DNA_DELIMITER = "-";
const HashlipsGiffer = require(`./HashlipsGiffer`);

let hashlipsGiffer = null;

const buildSetup = (configs, user_name) => {
  buildDir = `${basePath}/${user_name}/build`
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
  fs.mkdirSync(`${buildDir}/json`);
  fs.mkdirSync(`${buildDir}/images`);
  if (configs.gif.export) {
    fs.mkdirSync(`${buildDir}/gifs`);
  }
};

const getRarityWeight = (_str, config) => {
  let nameWithoutExtension = _str.slice(0, -4);
  var nameWithoutWeight = Number(
    nameWithoutExtension.split(config.rarityDelimiter).pop()
  );
  if (isNaN(nameWithoutWeight)) {
    nameWithoutWeight = 1;
  }
  return nameWithoutWeight;
};

const cleanDna = (_str) => {
  const withoutOptions = removeQueryStrings(_str);
  var dna = Number(withoutOptions.split(":").shift());
  return dna;
};

const cleanName = (_str, config) => {
  let nameWithoutExtension = _str.slice(0, -4);
  var nameWithoutWeight = nameWithoutExtension.split(config.rarityDelimiter).shift();
  return nameWithoutWeight;
};

const getElements = (path, config) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index,
        name: cleanName(i, config),
        filename: i,
        path: `${path}${i}`,
        weight: getRarityWeight(i, config),
      };
    });
};

const layersSetup = (layersOrder, config) => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    elements: getElements(`${layersDir}/${layerObj.name}/`, config),
    name:
      layerObj.options?.["displayName"] != undefined
        ? layerObj.options?.["displayName"]
        : layerObj.name,
    blend:
      layerObj.options?.["blend"] != undefined
        ? layerObj.options?.["blend"]
        : "source-over",
    opacity:
      layerObj.options?.["opacity"] != undefined
        ? layerObj.options?.["opacity"]
        : 1,
    bypassDNA:
      layerObj.options?.["bypassDNA"] !== undefined
        ? layerObj.options?.["bypassDNA"]
        : false,
  }));
  return layers;
};

const saveImage = (_editionCount, canvas) => {
  fs.writeFileSync(
    `${buildDir}/images/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
};

const genColor = (config) => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, ${config.background.brightness})`;
  return pastel;
};

const drawBackground = (ctx, config) => {
  ctx.fillStyle = config.background.static ? config.background.default : genColor(config);
  ctx.fillRect(0, 0, config.format.width, config.format.height);
};

const addMetadata = (_dna, _edition, config) => {
  let dateTime = Date.now();
  let tempMetadata = {
    name: `${config.namePrefix} #${_edition}`,
    description: config.description,
    file_url: `${config.baseUri}/${_edition}.png`,
    custom_fields: {
      dna: sha1(_dna),
      edition: _edition,
      date: dateTime,
      compiler: "HashLips Art Engine",
    },
    ...config.extraMetadata,
    attributes: attributesList,
  };
  if (config.network == NETWORK.sol) {
    tempMetadata = {
      //Added metadata for solana
      name: tempMetadata.name,
      symbol: config.solanaMetadata.symbol,
      description: tempMetadata.description,
      //Added metadata for solana
      seller_fee_basis_points: config.solanaMetadata.seller_fee_basis_points,
      image: `image.png`,
      //Added metadata for solana
      external_url: config.solanaMetadata.external_url,
      edition: _edition,
      ...config.extraMetadata,
      attributes: tempMetadata.attributes,
      properties: {
        files: [
          {
            uri: "image.png",
            type: "image/png",
          },
        ],
        category: "image",
        creators: config.solanaMetadata.creators,
      },
    };
  }
  metadataList.push(tempMetadata);
  attributesList = [];
};

const addAttributes = (_element) => {
  let selectedElement = _element.layer.selectedElement;
  attributesList.push({
    trait_type: _element.layer.name.trim(),
    value: selectedElement.name.trim(),
  });
};

const loadLayerImg = async (_layer) => {
  return new Promise(async (resolve) => {
    const image = await loadImage(`${_layer.selectedElement.path}`);
    resolve({ layer: _layer, loadedImage: image });
  });
};

const addText = (_sig, x, y, size, ctx, text) => {
  ctx.fillStyle = text.color;
  ctx.font = `${text.weight} ${size}pt ${text.family}`;
  ctx.textBaseline = text.baseline;
  ctx.textAlign = text.align;
  ctx.fillText(_sig, x, y);
};

const drawElement = (_renderObject, _index, _layersLen, ctx, config) => {
  ctx.globalAlpha = _renderObject.layer.opacity;
  ctx.globalCompositeOperation = _renderObject.layer.blend;
  config.text.only
    ? addText(
        `${_renderObject.layer.name}${config.text.spacer}${_renderObject.layer.selectedElement.name}`,
        config.text.xGap,
        config.text.yGap * (_index + 1),
        config.text.size,
        ctx,
        config.text
      )
    : ctx.drawImage(
        _renderObject.loadedImage,
        0,
        0,
        config.format.width,
        config.format.height
      );

  addAttributes(_renderObject);
};

const constructLayerToDna = (_dna = "", _layers = []) => {
  let mappedDnaToLayers = _layers.map((layer, index) => {
    let selectedElement = layer.elements.find(
      (e) => e.id == cleanDna(_dna.split(DNA_DELIMITER)[index])
    );
    return {
      name: layer.name,
      blend: layer.blend,
      opacity: layer.opacity,
      selectedElement: selectedElement,
    };
  });
  return mappedDnaToLayers;
};

/**
 * In some cases a DNA string may contain optional query parameters for options
 * such as bypassing the DNA isUnique check, this function filters out those
 * items without modifying the stored DNA.
 *
 * @param {String} _dna New DNA string
 * @returns new DNA string with any items that should be filtered, removed.
 */
const filterDNAOptions = (_dna) => {
  const dnaItems = _dna.split(DNA_DELIMITER);
  const filteredDNA = dnaItems.filter((element) => {
    const query = /(\?.*$)/;
    const querystring = query.exec(element);
    if (!querystring) {
      return true;
    }
    const options = querystring[1].split("&").reduce((r, setting) => {
      const keyPairs = setting.split("=");
      return { ...r, [keyPairs[0]]: keyPairs[1] };
    }, []);

    return options.bypassDNA;
  });

  return filteredDNA.join(DNA_DELIMITER);
};

/**
 * Cleaning function for DNA strings. When DNA strings include an option, it
 * is added to the filename with a ?setting=value query string. It needs to be
 * removed to properly access the file name before Drawing.
 *
 * @param {String} _dna The entire newDNA string
 * @returns Cleaned DNA string without querystring parameters.
 */
const removeQueryStrings = (_dna) => {
  const query = /(\?.*$)/;
  return _dna.replace(query, "");
};

const isDnaUnique = (_DnaList = new Set(), _dna = "") => {
  const _filteredDNA = filterDNAOptions(_dna);
  return !_DnaList.has(_filteredDNA);
};

const createDna = (_layers) => {
  let randNum = [];
  _layers.forEach((layer) => {
    var totalWeight = 0;
    layer.elements.forEach((element) => {
      totalWeight += element.weight;
    });
    // number between 0 - totalWeight
    let random = Math.floor(Math.random() * totalWeight);
    for (var i = 0; i < layer.elements.length; i++) {
      // subtract the current weight from the random weight until we reach a sub zero value.
      random -= layer.elements[i].weight;
      if (random < 0) {
        return randNum.push(
          `${layer.elements[i].id}:${layer.elements[i].filename}${
            layer.bypassDNA ? "?bypassDNA=true" : ""
          }`
        );
      }
    }
  });
  return randNum.join(DNA_DELIMITER);
};

const writeMetaData = (_data) => {
  fs.writeFileSync(`${buildDir}/json/_metadata.json`, _data);
};

const saveMetaDataSingleFile = (_editionCount, config) => {
  let metadata = metadataList.find((meta) => meta.custom_fields.edition == _editionCount);
  config.debugLogs
    ? console.log(
        `Writing metadata for ${_editionCount}: ${JSON.stringify(metadata)}`
      )
    : null;
  fs.writeFileSync(
    `${buildDir}/json/${_editionCount}.json`,
    JSON.stringify(metadata, null, 2)
  );
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const startCreating = async (configs, user_name) => {
  let layerConfigIndex = 0;
  let editionCount = 1;
  let failedCount = 0;
  let abstractedIndexes = [];
  layersDir = `${basePath}/${user_name}/layers`

    //create canvas
    const canvas = createCanvas(configs.format.width, configs.format.height);
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = configs.format.smoothing;

  for (
    let i = configs.network == NETWORK.sol ? 0 : 1;
    i <= configs.layerConfigurations[configs.layerConfigurations.length - 1].growEditionSizeTo;
    i++
  ) {
    abstractedIndexes.push(i);
  }
  if (configs.shuffleLayerConfigurations) {
    abstractedIndexes = shuffle(abstractedIndexes);
  }
  configs.debugLogs
    ? console.log(new Date(), " Editions left to create: ", abstractedIndexes)
    : null;
  while (layerConfigIndex < configs.layerConfigurations.length) {
    const layers = layersSetup(
      configs.layerConfigurations[layerConfigIndex].layersOrder,
      configs
    );
    while (
      editionCount <= configs.layerConfigurations[layerConfigIndex].growEditionSizeTo
    ) {
      let newDna = createDna(layers);
      if (isDnaUnique(dnaList, newDna)) {
        let results = constructLayerToDna(newDna, layers);
        let loadedElements = [];

        results.forEach((layer) => {
          loadedElements.push(loadLayerImg(layer));
        });

        await Promise.all(loadedElements).then((renderObjectArray) => {
          configs.debugLogs ? console.log("Clearing canvas") : null;
          ctx.clearRect(0, 0, configs.format.width, configs.format.height);
          if (configs.gif.export) {
            hashlipsGiffer = new HashlipsGiffer(
              canvas,
              ctx,
              `${buildDir}/gifs/${abstractedIndexes[0]}.gif`,
              configs.gif.repeat,
              configs.gif.quality,
              configs.gif.delay
            );
            hashlipsGiffer.start();
          }
          if (configs.background.generate) {
            drawBackground(ctx, configs);
          }
          renderObjectArray.forEach((renderObject, index) => {
            drawElement(
              renderObject,
              index,
              configs.layerConfigurations[layerConfigIndex].layersOrder.length,
              ctx,
              configs
            );
            if (configs.gif.export) {
              hashlipsGiffer.add();
            }
          });
          if (configs.gif.export) {
            hashlipsGiffer.stop();
          }
          configs.debugLogs
            ? console.log("Editions left to create: ", abstractedIndexes)
            : null;
          saveImage(abstractedIndexes[0], canvas);
          addMetadata(newDna, abstractedIndexes[0], configs);
          saveMetaDataSingleFile(abstractedIndexes[0], configs);
          console.log(new Date(),
            ` Created edition: ${abstractedIndexes[0]}, with DNA: ${sha1(
              newDna
            )}`
          );
        });
        dnaList.add(filterDNAOptions(newDna));
        editionCount++;
        abstractedIndexes.shift();
      } else {
        console.log(new Date(), " DNA exists!");
        failedCount++;
        console.log(failedCount)
        if (failedCount >= configs.uniqueDnaTorrance) {
          console.log(new Date(), 
            ` You need more layers or elements to grow your edition to ${configs.layerConfigurations[layerConfigIndex].growEditionSizeTo} artworks!`
          );
          return editionCount;
        }
      }
    }
    layerConfigIndex++;
  }
  writeMetaData(JSON.stringify(metadataList, null, 2));
  return editionCount;
};

module.exports = { startCreating, buildSetup, getElements };
