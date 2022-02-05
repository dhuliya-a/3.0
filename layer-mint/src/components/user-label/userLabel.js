import './userLabel.css';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from './../../context';

function UserLabel() {

  const { currentSection } = useContext(AppContext);
  const { currentUserName } = useContext(AppContext);

  useEffect(() => {
    // Update the document title using the browser API
    console.log("label at the beginning section : ", currentSection);
  });

   return (
      <div className="user-label">
        {<h1 className={currentSection=="user-name"?"hide-user-title":"user-title"}>Hi, {currentUserName}!</h1>}
      </div>
    );
  }
  
  export default UserLabel;
  