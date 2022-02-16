import './generatedPreview.css';

import React from 'react';
import { useState, useEffect, useContext } from 'react';
// import Context from './../landing';
import { AppContext } from '../../../context';
import LoadingOverlay from 'react-loading-overlay';
import {Parallax} from 'react-scroll-parallax';

function useTilt(active) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current || !active) {
      return;
    }

    const state = {
      rect: undefined,
      mouseX: undefined,
      mouseY: undefined
    };

    let el = ref.current;

    const handleMouseMove = (e) => {
      if (!el) {
        return;
      }
      if (!state.rect) {
        state.rect = el.getBoundingClientRect();
      }
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
      const px = (state.mouseX - state.rect.left) / state.rect.width;
      const py = (state.mouseY - state.rect.top) / state.rect.height;

      el.style.setProperty("--px", px);
      el.style.setProperty("--py", py);
    };

    el.addEventListener("mousemove", handleMouseMove);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
    };
  }, [active]);

  return ref;
}

function Slide({ slide, offset }) {
  const active = offset === 0 ? true : null;
  const ref = useTilt(active);

  return (
    <div
      ref={ref}
      className="slide"
      data-active={active}
      style={{
        "--offset": offset,
        "--dir": offset === 0 ? 0 : offset > 0 ? 1 : -1
      }}
    >
      <div
        className="slideBackground"
        style={{
          backgroundImage: `url('${slide.image}')`
        }}
      />
      <div
        className="slideContent"
        style={{
          backgroundImage: `url('${slide.image}')`
        }}
      >
        <div className="slideContentInner">
          <h2 className="slideTitle">{slide.title}</h2>
          <h3 className="slideSubtitle">{slide.subtitle}</h3>
          <p className="slideDescription">{slide.description}</p>
        </div>
      </div>
    </div>
  );
}

const initialState = {
  slideIndex: 0
};

const slidesReducer = (state, event) => {
  if (event.type === "NEXT") {
    return {
      ...state,
      slideIndex: (state.slideIndex + 1) % slides.length
    };
  }
  if (event.type === "PREV") {
    return {
      ...state,
      slideIndex:
        state.slideIndex === 0 ? slides.length - 1 : state.slideIndex - 1
    };
  }
};

function GeneratedPreview() {
  const [isMinting, setIsMinting] = useState(false);
  
  const { generatedImages, setCurrentProgress } = useContext(AppContext);
  const [state, dispatch] = React.useReducer(slidesReducer, initialState);
  
  async function mintCollection(userName, chainName, collectionName) {
    var confirmStatus = window.confirm(`Are you sure you wish to mint this collection over ${chainName}?`) ? "confirm" : "cancel";
    if(confirmStatus==="confirm"){
      setIsMinting(true);
      var mintUrl = `http://52.66.253.150:9009/mint`;
          axios.post(mintUrl, {
            user_name: userName,
            mint_to_address: "0x7A8FD49CB94B3a9E8e72365D9240Fb5E64280493",
            chain: chainName,
            collection_name: collectionName
          }).then(response => {

            console.log("MINT RES : ", response.data);
            setIsMinting(false);
            setCurrentProgress("100%");  
          }).catch(err=>{
            alert("NOT MINTED : ",err);
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
      text='Loading your content...'
      >
      <div className="preview-slider">
        <div className="slides">
          <button onClick={() => dispatch({ type: "PREV" })}>‹</button>

          {generatedImages && generatedImages.map((imageUrl, i) => {
            let offset = generatedImages.length + (state.slideIndex - i);
            return <Slide slide={imageUrl} offset={offset} key={i} />;
          })}
          <button onClick={() => dispatch({ type: "NEXT" })}>›</button>
        </div>
      </div>
       <div className="mint-options">
           <button onClick={(e)=>{mintCollection(e, "polygon")}} className='mint-button layermint'>Mint with polygon</button>
          
           <button onClick={(e)=>{mintCollection(e, "rinkeby")}} className='mint-button layermint'>Mint with rinkeby</button>
       </div>
      </LoadingOverlay>
    </div>
  );
}

export default GeneratedPreview;


// <div className='preview-gallery-container'>
//          {/* slider-inner */}
      
//          {generatedImages && generatedImages.map((imageUrl, i) => 
       
//         <div className='preview-image-container'>

//             <img src={imageUrl}></img>

//        </div>
    
//        )}           

      
//        </div>
//       <div className="mint-options">
//           <button onClick={(e)=>{mintCollection(e, "polygon")}} className='mint-button layermint'>Mint with polygon</button>
          
//           <button onClick={(e)=>{mintCollection(e, "rinkeby")}} className='mint-button layermint'>Mint with rinkeby</button>
//       </div>