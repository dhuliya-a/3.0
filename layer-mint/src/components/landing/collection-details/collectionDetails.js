import './collectionDetails.css';

import React from 'react';
import { useState } from 'react';

function CollectionDetails() {

  const [collectionName, setCollectionName] = useState('');
  const [collectionAssetSize, setCollectionAssetSize] = useState('');
  const [collectionDesc, setCollectionDesc] = useState('');
  const [collectionPixelX, setCollectionPixelX] = useState('');
  const [collectionPixelY, setCollectionPixelY] = useState('');

  const handleSubmit = event => {
    
    let pixelArry = [collectionPixelX, collectionPixelY];
    sessionStorage.setItem('pixel_dimensions', pixelArry);
    sessionStorage.setItem('asset_count', collectionAssetSize);
    sessionStorage.setItem('collection_name', collectionName);
    sessionStorage.setItem('collection_description', collectionDesc);
    event.preventDefault();
  }

  return (
    <div id="collection-details">
      <div className="collection-details-form-container">
        <div className="collection-details-header">
          collection details
        </div>
        <form className="collection-details-form" onSubmit={handleSubmit}>
          <label className="collection-name-label">
            Collection name
          </label>
          <input type="text" className="collection-name-input" name="collection-name" value={collectionName} onInput={e => setCollectionName(e.target.value)}/>
          <label className="collection-desc-label">
            Description
          </label>
          <input type="text" className="collection-desc-input" name="collection-desc" value={collectionDesc} onInput={e => setCollectionDesc(e.target.value)}/>
          <label className="collection-asset-size-label">
            Collection's asset size
          </label>
          <input type="text" className="collection-asset-size-input" name="collection-asset-size" value={collectionAssetSize} onInput={e => setCollectionAssetSize(e.target.value)}/>
          <label className="collection-pixel-size-label">
            Collection's dimensions(in pixels)
          </label>
          <label className="collection-pixel-size-label" >
            X(in pixels)
          </label>
          <input type="text" className="collection-pixel-size-input" name="collection-pixel-x" value={collectionPixelX} onInput={e => setCollectionPixelX(e.target.value)}/>
          <label className="collection-pixel-size-label">
            Y(in pixels)
          </label>
          <input type="text" className="collection-pixel-size-input" name="collection-pixel-y" value={collectionPixelY} onInput={e => setCollectionPixelY(e.target.value)}/>
          <input type="submit" value="Submit" />
        </form>
      </div>
      {/* <div className="collection-details-image">
        <div className="collection-image"></div>
      </div> */}
    </div>
  );
}

export default CollectionDetails;
