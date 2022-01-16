import './userLogin.css';

function UserLogin() {
  return (
    <div className="user-login">
        <form className="user-login-form">
          <label className="user-login-label">
            Please enter your user name
          </label>
          
          <input type="text" className="username-input" name="name" />
          <input type="submit" value="Submit" />
        </form>
    </div>
  );
}

export default UserLogin;
