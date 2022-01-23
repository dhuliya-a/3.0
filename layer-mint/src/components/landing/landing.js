import './landing.css';
import UserLogin from './user-login/userLogin';
import CollectionDetails from './collection-details/collectionDetails';
import LayerDetails from './layer-details/layerDetails';
import GeneratedPreview from './generated-preview/generatedPreview';

import { useState, createContext } from 'react';
import Scroll from '../../Scroll.js';

// const Context = createContext({ generatedImages: null, setGeneratedImages: () => {} });

function Landing() {

  const [generatedImages, setGeneratedImages] = useState([]);

  return (
    <div className="landing">
        <UserLogin></UserLogin>
        <CollectionDetails></CollectionDetails>
        {/* <Context.Provider value={{generatedImages, setGeneratedImages}}> */}
        <LayerDetails></LayerDetails>
        <GeneratedPreview></GeneratedPreview>
        {/* <Scroll /> */}
        {/* </Context.Provider> */}
    </div>
  );
}

export default Landing;
