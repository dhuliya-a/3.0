import './generatedPreview.css';

import React from 'react';
import { useState, useEffect, useContext } from 'react';
// import Context from './../landing';
import { AppContext } from '../../../context';
import LoadingOverlay from 'react-loading-overlay';
import { Parallax } from 'react-scroll-parallax';
import axios from 'axios';


function GeneratedPreview() {
  const [isMinting, setIsMinting] = useState(false);

  const { generatedImages, setCurrentProgress } = useContext(AppContext);

  async function mintCollection(event, chainName) {
    var confirmStatus = window.confirm(`Are you sure you wish to mint this collection over ${chainName}?`) ? "confirm" : "cancel";
    if (confirmStatus === "confirm") {
      setIsMinting(true);
      // http://52.66.253.150:9009
      var mintUrl = `http://52.66.253.150:9009/mint`;
      axios.post(mintUrl, {
        user_name: sessionStorage.getItem("user_name"),
        mint_to_address: "0x7A8FD49CB94B3a9E8e72365D9240Fb5E64280493",
        chain: chainName,
        collection_name: sessionStorage.getItem("collection_name")
      }).then(response => {

        console.log("MINT RES : ", response.data);
        setIsMinting(false);
        // setCurrentProgress("100%");
        alert(response.data.message);
        window.open(response.data.opensea_url, '_blank', 'noopener,noreferrer')
      }).catch(err => {
        alert("NOT MINTED : ", err);
        throw err;
      })
    }
  }

  return (
    <div id="generated-preview">
      <LoadingOverlay
        className="loader"
        active={isMinting}
        spinner
        text='Minting your collection...'
      >
        <div className='preview-gallery-container'>
          {/* slider-inner */}
          <div className="preview-gallery">
            
          {generatedImages && generatedImages.map((imageUrl, i) =>

            <div className='preview-image-container'>

              <img src={imageUrl}></img>

            </div>

          )}
        </div>
        </div>
        <div className="mint-options">
          <button onClick={(e) => { mintCollection(e, "polygon") }} className='mint-button layermint'>Mint with polygon</button>

          <button onClick={(e) => { mintCollection(e, "rinkeby") }} className='mint-button layermint'>Mint with rinkeby</button>
        </div>
      </LoadingOverlay>
    </div>
  );
}

export default GeneratedPreview;