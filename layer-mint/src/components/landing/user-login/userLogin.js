import './userLogin.css';

import React from 'react';
import { useState } from 'react';

function UserLogin() {

  const [userName, setUserName] = useState("");
    
  const handleSubmit = event => {
    sessionStorage.setItem('user_name', userName);
    event.preventDefault();
  }

  const handleUserNameChange = event => {
    setUserName(event.target.value);
  }


  return (
    <div className="user-login">
        <form className="user-login-form" onSubmit={handleSubmit}>
          <label className="user-login-label">
            Please enter your user name
          </label>
          
          <input type="text" className="username-input" name="name" onChange={handleUserNameChange}/>
          <input type="submit" value="Submit" />
        </form>
    </div>
  );
}

export default UserLogin;
