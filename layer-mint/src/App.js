import './App.css';
import Landing from './components/landing/landing.js';
// import InfoBar from './components/info-bar/infoBar';
import UserLabel from './components/user-label/userLabel';
import ProgressBar from './components/progress-bar/progressBar';
import { AppContext } from './context';
import { useState, useEffect } from 'react';

function App() {
  
  const [ currentSection, setCurrentSection ] = useState('user-name');
  const [ currentUserName, setCurrentUserName ] = useState('');
  const [ generatedImages, setGeneratedImages ] = useState([]);
  const [ currentProgress, setCurrentProgress ] = useState("0");

  useEffect(() => {
    // Update the document title using the browser API
    console.log("allo section : ", currentSection);
  },[currentSection]);

  return (
    <div className="App">
      <AppContext.Provider value={{ currentSection, setCurrentSection, currentUserName, setCurrentUserName, currentProgress, setCurrentProgress, generatedImages, setGeneratedImages }}>
        <UserLabel></UserLabel>
        <ProgressBar></ProgressBar>
        <Landing></Landing>
      </AppContext.Provider>
    </div>
  );
}

export default App;
