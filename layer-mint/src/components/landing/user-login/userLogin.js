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
    setUserName(event.target.value);
  }


  return (
    <div id="user-login">
        <form className="user-login-form" onSubmit={handleSubmit}>
          <div  className="app-details">
            <div className="detail-header">This is <span className='layermint'>layermint.</span></div>
            <div className="detail-subtext">An image generation & NFT-minting tool using your layer assets.</div>
            <div className="detail-subtext">To create your own collection, enter your</div>
            {/* <span style={{color:'red', fontWeight: 'bold'}}>AUTHOR NAME</span> */}
          </div>
          <input type="text" placeholder='AUTHOR NAME' className="username-input" name="name" onChange={handleUserNameChange}/>
          {/* <input type="submit" value="Submit" /> */}
        </form>
    </div>
  );
}

export default UserLogin;
