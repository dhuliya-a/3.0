import './userLogin.css';

import React from 'react';
import { useState } from 'react';

function UserLogin() {

  const [userName, setUserName] = useState("");
    
  const handleSubmit = event => {
    sessionStorage.setItem('user_name', userName);
    //TODO - move to next section
    const nextDiv = document.getElementById("collection-details");
    console.log("next div : ", nextDiv);
    nextDiv.scrollIntoView();
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
            <div className="detail-header">This is <span className='layermint'>layermint.</span></div>
            <div className="detail-subtext">An image generation & NFT-minting tool using your layer assets.</div>
            <div className="detail-subtext">To create your own collection, enter the <span className='author-name'>author name.</span></div>
            {/*  */}
          </div>
          <input type="text" placeholder='author name' className="username-input" autoComplete='off' name="name" onChange={handleUserNameChange}/>
          {/* <input type="submit" value="Submit" /> */}
        </form>
    </div>
  );
}

export default UserLogin;
