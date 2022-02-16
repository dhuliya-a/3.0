import './layerDetails.css';
import React from 'react';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../../../context';
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';

function LayerDetails() {

  const { setGeneratedImages } = useContext(AppContext);

  const { setCurrentSection } = useContext(AppContext);
  const { setCurrentProgress } = useContext(AppContext);

  const [values, setValues] = useState({ val: [] });

  const [currentFiles, setCurrentFiles] = useState([]);
  const [uploadedLayers, setUploadedLayers] = useState([]);
  const [uploadedRarities, setUploadedRarities] = useState([]);
  const [currentRarities, setCurrentRarities] = useState({});
  const [finalLayers, setFinalLayers] = useState([]);

  useEffect(() => {
    addClick();
  }, []);

  function createInputs() {
    return values.val.map((el, i) =>
      <details key={i} className='layer-component' open="true">

        <summary className="layer-data">
          <button style={{color: 'white'}}></button>
          <input type="text" value={el || ''} className='layer-component-input' placeholder='layer name' onChange={handleNameChange.bind(i)} />
          <input type="file" name="fileName" className='layer-component-file-input' multiple onChange={handleFileChange}></input>
          <button className = 'layer-data-button' onClick={(e) => handleFileUploadClick(e, i)}>Choose files</button>
          {
            values.val.length > 1 && <IoMdRemoveCircleOutline value='remove' className='layer-button' name={i} onClick={removeClick.bind(i)} disabled></IoMdRemoveCircleOutline>
          }
        </summary>
        <div className="layer-component-content">
          <div className="layer-preview">
            <div className="preview-header">
              Choose rarity for the asset between 0-100. Default value is 100.
            </div>
            {/* For every file uploaded */}
            {currentFiles.length != 0  && uploadedLayers[el]==undefined ? 
            <div className="image-preview">
            {Array.from(currentFiles).map((object, i) =>
              <div className="image-detail-container">
                <img src={URL.createObjectURL(object)} alt="" />
                <input type="text" className='layer-component-input' onChange={(e) => handleRarityChange(e, object, el)} />
              </div>)}</div>
              : 
              
              uploadedLayers[el] && uploadedLayers[el].length > 0 ? 
              <div className="image-preview">
                {Array.from(uploadedLayers[el]).map((object, i) =>
                
                <div className="image-detail-container">
                  <img src={URL.createObjectURL(object)} alt="" />
                  <input type="text"  value={uploadedRarities[el][object.name]}  className='layer-component-input' onChange={(e) => handleRarityChange(e, object, el)} />
                </div>)}
                </div>
                : null}
          
          </div>
          <div className="layer-upload">
            <button value="upload" className='layer-data-button' onClick={(e) => handleUpload(e, i, el)}>upload</button>
          </div>
        </div>
      </details>
    );
  }
  function handleNameChange(event) {
    let vals = [...values.val];
    vals[this] = event.target.value;
    setValues({ val: vals });
    console.log(vals);
  }

  function handleRarityChange(event, object, el) {
    var tempRarities = currentRarities;
    tempRarities[object.name] = event.target.value;
    console.log("Current rarities : ", JSON.stringify(tempRarities));
    setCurrentRarities(tempRarities);
  }

  function handleFileUploadClick(event, i) {
    let fileButton = document.getElementsByClassName("layer-component-file-input")[0].click();
  }
  async function handleUpload(event, i) {
    var layerDetail = document.getElementsByClassName("layer-component")[i];
    layerDetail.removeAttribute("open");
    let vals = [...finalLayers];
    vals.push(values.val);
    setFinalLayers(vals);
    let res = await uploadLayerFilesFile(currentFiles, i);
    addClick();
  }

  function handleRarityDefaults(files, currentRarities) {

    var tempRarities = currentRarities;
    console.log("rarity object : ", tempRarities);
    Array.from(files).map((object) => {
      if (!object.name in tempRarities) {
        tempRarities[object.name] = 100;
      }
    });
    return JSON.stringify(tempRarities);
  }
  async function uploadLayerFilesFile(files, i) {
    const formData = new FormData();
    const userName = sessionStorage.getItem('user_name');
    console.log("current files : ", currentFiles);
    console.log(values.val[i]);
    formData.append(`rarity`, handleRarityDefaults(files, currentRarities));
    console.log(files.length);
    for (let i = 0; i < files.length; i++) {
      formData.append(`files`, files[i]);
    }

    var layerName = values.val[i];
    console.log("form data : ", formData);
    var tempUploadedLayers = uploadedLayers;
    tempUploadedLayers[layerName] = files;
    setUploadedLayers(tempUploadedLayers);
    var tempRarities = uploadedRarities;
    tempRarities[layerName] = currentRarities;
    setUploadedRarities(tempRarities);
    console.log('uploaded layers : ', JSON.stringify(uploadedLayers));
    setCurrentFiles([]);
    var uploadUrl = `http://52.66.253.150:9009/layerUpload/${userName}/layer/${values.val[i]}`;
    console.log(uploadUrl);
    axios.post(uploadUrl, formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }).then(response => {
      console.log("POST RES : ", response.data);
    });
  }


  const addClick = () => {
    setValues({ val: [...values.val, ''] })
  }
  const handleFileChange = (event) => {
    const files = event.target.files;
    setCurrentFiles(files);
    // for (let i = 0; i < files.length; i++) {
    //     alert(`images[${i}]`, files[i])
    // }
  }

  const removeClick = (event) => {
    let vals = [...values.val];
    let index = Number(event.target.name);
    vals.splice(index, 1);
    setValues({ val: vals });
  }


  async function handleSubmit(event) {
    sessionStorage.setItem('layers', finalLayers);
    console.log("Final layers : ", values.val);
    //send request for collection. take values from sessionStorage.
    var username = sessionStorage.getItem('user_name');
    var layers = values.val;
    var pixels = sessionStorage.getItem('pixel_dimensions').split(",");
    var pixelDimensions = [];
    pixelDimensions.push(parseInt(pixels[0]));
    pixelDimensions.push(parseInt(pixels[1]));
    var assetCount = sessionStorage.getItem('asset_count');
    var collectionName = sessionStorage.getItem('collection_name');
    var collectionDesc = sessionStorage.getItem('collection_description');
    //ignore last layer in layers.
    let res = await generateImages(username, pixelDimensions, layers, assetCount, collectionName, collectionDesc);
    event.preventDefault();
  }

  async function generateImages(username, pixelDimensions, layers, assetCount, collectionName, collectionDesc) {
    // const formData = new FormData();
    // formData.append('user_name', username);
    // formData.append('layers', layers);
    // formData.append('pixel_dimensions', pixelDimensions);
    // formData.append('asset_count', assetCount);
    // formData.append('collection_name', collectionName);
    // formData.append('collection_description', collectionDesc);
    var generateUrl = `http://52.66.253.150:9009/generateAssets`;
    axios.post(generateUrl, {
      user_name: username,
      layers: layers,
      pixel_dimensions: pixelDimensions,
      asset_count: assetCount,
      collection_name: collectionName,
      collection_description: collectionDesc
    }).then(response => {

      console.log("GENERATE POST RES : ", response.data);
      sessionStorage.setItem('generated-images', response.data.image_url);
      setGeneratedImages(response.data.image_url);
      const nextDiv = document.getElementById("generated-preview");
      console.log("next div : ", nextDiv);
      nextDiv.scrollIntoView({behavior: 'smooth'});
      setCurrentSection('generated-preview');
      setCurrentProgress("90%");  
    });
  }

  function handleTest(){
    console.log("uploaded layers : ", uploadedLayers);
  }
  // const handleSubmit = event => {
  // sessionStorage.setItem('layers', finalLayers);
  // event.preventDefault();
  // }
  return (
    <div id="layer-details">
      <div className="layers-form">
        <div className="layers-index">
          {createInputs()}
        </div>
        <form onSubmit={handleSubmit} className='layer-detail-submit'>
          <input type="submit" value="generate" className='layer-submit-button layermint' />
        </form>
      </div>
      {/* <button onClick={handleTest}></button> */}
    </div>
  );
}

export default LayerDetails;
