import './progressBar.css';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from './../../context';

function ProgressBar() {

  const { currentSection, currentProgress } = useContext(AppContext);
  useEffect(()=>{
    console.log("current progress : ", currentProgress);
  },[currentProgress]);


    return (
      <div className={currentSection=="user-name"?"hide-progress-bar": currentSection =="generated-preview"?"hide-progress-bar":"progress-bar"}>  
        {/* {<h1 className={currentSection=="user-name"?"hide-progress-bar":"progress-bar"}>Hi, {currentUserName}</h1>} */}
        <div className="progress-bar-status">
          <div className="actual-progress" style={{minHeight:currentProgress}}></div>
        </div> 
      </div>
    );
  }
  
  export default ProgressBar;
  