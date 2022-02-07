import './generatedPreview.css';

import React from 'react';
import { useState, useEffect, useContext } from 'react';
// import Context from './../landing';
import { AppContext } from '../../../context';

function GeneratedPreview() {
  const { generatedImages } = useContext(AppContext);
  
  const { setCurrentSection } = useContext(AppContext);
  const { setCurrentProgress } = useContext(AppContext);

  function handleMintWithPolyGon(){
    // setCurrentSection('done');
    setCurrentProgress("100%");
  }
  return (
    <div id="generated-preview">
       {/* Generated Preview */}
       {/* <input type="button" value="get images" onClick={(e)=>handleGeneratedImages(e)}></input> */}
       <div className='preview-gallery'>
       {generatedImages && generatedImages.map((imageUrl, i) => 
        <div className='preview-image-container'>
       <img src={imageUrl}></img>
       </div>
       )}
       </div>
      <div className="mint-option">
          <button onClick={handleMintWithPolyGon}>Mint with polygon</button>
          
          <button onClick={handleMintWithPolyGon}>Mint with rinkeby</button>
      </div>
    </div>
  );
}

export default GeneratedPreview;
