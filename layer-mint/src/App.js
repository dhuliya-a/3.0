import './App.css';
import Landing from './components/landing/landing.js';
// import InfoBar from './components/info-bar/infoBar';
import UserLabel from './components/user-label/userLabel';
import ProgressBar from './components/progress-bar/progressBar';

function App() {
  return (
    <div className="App">
      <UserLabel></UserLabel>
      <ProgressBar></ProgressBar>
      <Landing></Landing>
    </div>
  );
}

export default App;
