import './progressBar.css';
import { useState } from 'react';

function ProgressBar() {
  const [isLandingSlide, setIsLandingSlide] = useState(true);
    return (
      !isLandingSlide && <div className="progress-bar">
        <div className="progress-bar-status"></div> 
      </div>
    );
  }
  
  export default ProgressBar;
  