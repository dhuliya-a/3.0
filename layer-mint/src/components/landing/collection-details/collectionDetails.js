import './collectionDetails.css';

import React from 'react';
import { useState, useContext } from 'react';
import { AppContext } from '../../../context';

function CollectionDetails() {

  const [collectionName, setCollectionName] = useState('');
  const [collectionAssetSize, setCollectionAssetSize] = useState('');
  const [collectionDesc, setCollectionDesc] = useState('');
  const [collectionPixelX, setCollectionPixelX] = useState('');
  const [collectionPixelY, setCollectionPixelY] = useState('');

  const { setCurrentSection } = useContext(AppContext);
  const { setCurrentProgress } = useContext(AppContext);

  const handleSubmit = event => {
    let pixelArry = [collectionPixelX, collectionPixelY];
    sessionStorage.setItem('pixel_dimensions', pixelArry);
    sessionStorage.setItem('asset_count', collectionAssetSize);
    sessionStorage.setItem('collection_name', collectionName);
    sessionStorage.setItem('collection_description', collectionDesc);

    const nextDiv = document.getElementById("layer-details");
    console.log("next div : ", nextDiv);
    nextDiv.scrollIntoView({behavior: 'smooth'});
    setCurrentSection('layer-details');
    setCurrentProgress("50%");
    
    event.preventDefault();
  }

  return (
    <div id="collection-details">
      <div className="collection-details-subtext">
      Integer ultricies tincidunt dapibus. Pellentesque fermentum imperdiet purus a elementum. Quisque in venenatis ex. Sed quis nunc magna. 
      Aliquam sed quam nec quam aliquet euismod ac pulvinar massa. Donec nec eleifend odio. elit.
      </div>
      <form className="collection-details-form" onSubmit={handleSubmit}>
        <div className="collection-form collection-name">
          <input type="text" className="collection-name-input" name="collection-name" value={collectionName} onInput={e => setCollectionName(e.target.value)} />
          <label className="collection-name-label">collection name</label>
        </div>
        <div className="collection-description">
          <textarea type="text" className="collection-desc-input" name="collection-desc" value={collectionDesc} onInput={e => setCollectionDesc(e.target.value)} />
          <label className="collection-desc-label" style={{marginLeft:'1%'}}>description</label>
        </div>
        <div className="collection-form collection-dimensions">
          <div className="collection-dim">
          <input type="text" className="collection-pixel-size-input" name="collection-pixel-x" value={collectionPixelX} onInput={e => setCollectionPixelX(e.target.value)} />
          <label className="collection-pixel-size-label" >
            x   (in pixels)
          </label>
          </div>
          <div className="collection-dim">
          <input type="text" className="collection-pixel-size-input" name="collection-pixel-y" value={collectionPixelY} onInput={e => setCollectionPixelY(e.target.value)} />
          <label className="collection-pixel-size-label">
            y   (in pixels)
          </label>
          </div>
        </div>
        <div className="collection-form collection-asset-size">
          <input type="text" className="collection-asset-size-input" name="collection-asset-size" value={collectionAssetSize} onInput={e => setCollectionAssetSize(e.target.value)} />
          <label className="collection-asset-size-label">
            collection's asset size
          </label>
        </div>
        <input type="submit" value="Submit" className='collection-detail-submit layermint' />
      </form>
    </div>
  );
}

export default CollectionDetails;


{/* <div className="collection-details-form-container">
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
      </div> */}
{/* <div className="collection-details-image">
        <div className="collection-image"></div>
      </div> */}