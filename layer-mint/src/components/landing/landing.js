import './landing.css';
import UserLogin from './user-login/userLogin';
import CollectionDetails from './collection-details/collectionDetails';
import LayerDetails from './layer-details/layerDetails';
import GeneratedPreview from './generated-preview/generatedPreview';
import { ParallaxProvider } from 'react-scroll-parallax';
import { useState, createContext } from 'react';
import Scroll from '../../Scroll.js';

// const Context = createContext({ generatedImages: null, setGeneratedImages: () => {} });

function Landing() {


  return (
    <div className="landing">
        <UserLogin></UserLogin>
        <CollectionDetails></CollectionDetails>
        {/* <Context.Provider value={{generatedImages, setGeneratedImages}}> */}
        <LayerDetails></LayerDetails>
        <ParallaxProvider>
        <GeneratedPreview></GeneratedPreview>
        </ParallaxProvider>
        {/* <Scroll /> */}
        {/* </Context.Provider> */}
    </div>
  );
}

export default Landing;
