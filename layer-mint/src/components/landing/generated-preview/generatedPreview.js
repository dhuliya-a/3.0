import './generatedPreview.css';

import React from 'react';
import { useState, useEffect, useContext } from 'react';
// import Context from './../landing';

function GeneratedPreview() {

    const [genImages, setGenImages] = useState([]);
    const handleGeneratedImages = () => {
        let varRes = sessionStorage.getItem('generated-images').split(',');
        console.log(varRes);
        // var tempList = sessionStorage.getItem('generated-images').split[","];
        // console.log(tempList);
    setGenImages(varRes);
}
  return (
    <div className="generated-preview">
       Generated Preview
       <input type="button" value="get images" onClick={(e)=>handleGeneratedImages(e)}></input>
       <div>
       {genImages.map((imageUrl, i) => <img src={imageUrl}></img>)}
       </div>
        
    </div>
  );
}

export default GeneratedPreview;
