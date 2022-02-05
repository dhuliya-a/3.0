import './layerDetails.css';
import React from 'react';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
// import Context from './../landing';
import {IoMdAddCircleOutline, IoMdRemoveCircleOutline} from 'react-icons/io';

function LayerDetails() {

    // const {setGeneratedImages} = useContext(Context);

    const [values, setValues] = useState({ val: []});
    
    const [currentFiles, setCurrentFiles] = useState([]);
    const [finalLayers, setFinalLayers] = useState([]);

    useEffect(()=>{
      addClick();
    },[]);

    function createInputs() {
        return values.val.map((el, i) =>

        //TODO - Collapsable component.
        // layer name,  choose files, preview modal(only when choose files is complete), upload button(only when all other steps + rarity is complete)
        // user clicks uplaod, disable choose files, make preview modal an Option, delete button enabled
        // another layer is added post upload
         
          <div key={i} className='layer-component'>
            {/* <div>{values.val[i]}</div> */}
            <input type="text" value={el||''} className='layer-component-input' onChange={handleNameChange.bind(i)} />
            <input type="file" name="fileName" className='layer-component-file-input' multiple onChange={handleFileChange}></input>
            <button onClick={(e)=>handleFileUploadClick(e,i)}>Choose files</button>
            <IoMdAddCircleOutline value="upload" className='layer-button' onClick={(e)=>handleUpload(e,i)}></IoMdAddCircleOutline>
            {
              values.val.length>1 && <IoMdRemoveCircleOutline value='remove' className='layer-button' name={i} onClick={removeClick.bind(i)} disabled></IoMdRemoveCircleOutline>
            }
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
    addClick();
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
      {createInputs()}
      <form onSubmit={handleSubmit} className='layer-detail-submit'>
          <input type="submit" value="Submit" />
      </form>
      </div>
    </div>
  );
}

export default LayerDetails;
