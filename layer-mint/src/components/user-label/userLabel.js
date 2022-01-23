import './userLabel.css';
import { useState } from 'react';

function UserLabel() {

  const [isLandingSlide, setIsLandingSlide] = useState(true);
    return (
      <div className="user-label">
        {isLandingSlide?null:<h1 className="user-title">Hi, adhuliya</h1>}
      </div>
    );
  }
  
  export default UserLabel;
  