import './layerDetails.css';
import React from 'react';
import { useState, useContext } from 'react';
import axios from 'axios';
// import Context from './../landing';
import {IoMdAddCircleOutline, IoMdRemoveCircleOutline} from 'react-icons/io';

function LayerDetails() {

    // const {setGeneratedImages} = useContext(Context);

    const [values, setValues] = useState({ val: []});
    
    const [currentFiles, setCurrentFiles] = useState([]);
    const [finalLayers, setFinalLayers] = useState([]);

    function createInputs() {
        return values.val.map((el, i) =>
          <div key={i} className='layer-component'>
            {/* <div>{values.val[i]}</div> */}
            <input type="text" value={el||''} className='layer-component-input' onChange={handleNameChange.bind(i)} />
            <input type="file" name="fileName" className='layer-component-file-input' multiple onChange={handleFileChange}></input>
            <button onClick={(e)=>handleFileUploadClick(e,i)}>Choose files</button>
            <IoMdAddCircleOutline value="upload" className='layer-button' onClick={(e)=>handleUpload(e,i)}></IoMdAddCircleOutline>
            <IoMdRemoveCircleOutline value='remove' className='layer-button' name={i} onClick={removeClick.bind(i)}></IoMdRemoveCircleOutline>
            {/* <button value='remove' name={i} onClick={removeClick.bind(i)}></button> */}
          </div>
        );
      }
    function handleNameChange(event) {
      let vals = [...values.val];
      vals[this] = event.target.value;
      setValues({ val: vals });
      console.log(vals);
    }

    function handleFileUploadClick(event, i){
      let fileButton = document.getElementsByClassName("layer-component-file-input")[0].click();
    }
    async function handleUpload(event, i) {
    let vals = [...finalLayers];
    vals.push(values.val);
    setFinalLayers(vals);
    let res = await uploadLayerFilesFile(currentFiles, i);
    }

    async function uploadLayerFilesFile(files, i){
      const formData = new FormData();
      const userName = sessionStorage.getItem('user_name');
      console.log(values.val[i]);
      console.log(files.length);
      for (let i = 0; i < files.length; i++) {
        formData.append(`files`, files[i])
    }

      // formData.append(`images[${i}]`, files[i])
      // /layerUpload/:user/layer/:layerName
      // formData.append('layer-files', files);

      
      var uploadUrl = `http://52.66.253.150:9009/layerUpload/${userName}/layer/${values.val[i]}`;
      console.log(uploadUrl);
      axios.post(uploadUrl, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }).then(response => {
        console.log("POST RES : ",response.data);
      });
    }

  
    const addClick = () => {
      setValues({ val: [...values.val, '']})
    }
    const handleFileChange = (event) => {
        const files = event.target.files;
        setCurrentFiles(files);
        for (let i = 0; i < files.length; i++) {
            alert(`images[${i}]`, files[i])
        }
      }
  
    const removeClick = (event) => {
      let vals = [...values.val];
      let index = Number(event.target.name);
      vals.splice(index, 1);
      setValues({ val: vals });
    }

    
  async function handleSubmit(event){
    sessionStorage.setItem('layers', finalLayers);
    console.log("Final layers : ", values.val);
    //send request for collection. take values from sessionStorage.
    var username = sessionStorage.getItem('user_name');
    var layers = values.val;
    var pixels =  sessionStorage.getItem('pixel_dimensions').split(",");
    var pixelDimensions = [];
    pixelDimensions.push(parseInt(pixels[0]));
    pixelDimensions.push(parseInt(pixels[1]));
    var assetCount = sessionStorage.getItem('asset_count');
    var collectionName = sessionStorage.getItem('collection_name');
    var collectionDesc = sessionStorage.getItem('collection_description');

    let res = await generateImages(username, pixelDimensions, layers, assetCount, collectionName, collectionDesc);
    event.preventDefault();
    }

    async function generateImages(username, pixelDimensions, layers, assetCount, collectionName, collectionDesc){
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
        
        console.log("GENERATE POST RES : ",response.data);
        sessionStorage.setItem('generated-images', response.data.image_url);
        // setGeneratedImages(response.data.image_url);
      });
    }

    // const handleSubmit = event => {
    // sessionStorage.setItem('layers', finalLayers);
    // event.preventDefault();
    // }
  return (
    <div id="layer-details">
      <div className="layers-form">
        <form onSubmit={handleSubmit}>
          <input type='button' value='add more' onClick={addClick} />
          <br/>
          <br/>
          <input type="submit" value="Submit" />
        </form>
      </div>
      <div className="layers-container">
        {createInputs()}
      </div>
    </div>
  );
}

export default LayerDetails;
