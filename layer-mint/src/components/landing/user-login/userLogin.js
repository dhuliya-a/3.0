import './userLogin.css';

import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../../context';

function UserLogin() {

  const [userName, setUserName] = useState("");

  const { setCurrentSection } = useContext(AppContext);
  const { setCurrentUserName } = useContext(AppContext);
  const { setCurrentProgress } = useContext(AppContext);
    
  const handleSubmit = event => {
    sessionStorage.setItem('user_name', userName);
    //TODO - move to next section
    const nextDiv = document.getElementById("collection-details");
    console.log("next div : ", nextDiv);
    nextDiv.scrollIntoView({behavior: 'smooth'});
    setCurrentUserName(userName);
    setCurrentSection('collection_name');
    setCurrentProgress("20%");
    event.preventDefault();
  }

  const handleUserNameChange = event => {
    const inputVal = event.target.value;
    console.log("input val : ", inputVal);
    setUserName(inputVal);
    const authorName = document.getElementsByClassName("author-name")[0];
    if(inputVal.length!=0){
      console.log("not empty");
      authorName.classList.add("hide-author-name");
      console.log("author name : ", authorName);
    }
    else{
      authorName.classList.remove("hide-author-name");
    }
  }


  return (
    <div id="user-login">
        <form className="user-login-form" onSubmit={handleSubmit}>
          <div  className="app-details">
            <div className="detail-header layermint">layermint.</div>
            <div className="detail-subtext">An image generation & NFT-minting tool using your layer assets to create your own collection.
Deploy it to a blockchain of your choice.</div>
            <div className="detail-subtext">
So artists can focus on creating.
Enter the<span className='author-name'> author name.</span></div>
            <input type="text" placeholder='author name' className="username-input" autoComplete='off' name="name" onChange={handleUserNameChange}/>
            <div className="form-submit">

            <input type="submit" value="begin" className='user-form-submit layermint' />
            </div>
          </div>
        </form>
    </div>
  );
}

export default UserLogin;
