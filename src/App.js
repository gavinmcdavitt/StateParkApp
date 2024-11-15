import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/home/index';
import { AboutUs } from './pages/about-us';
import { AuthPage } from './pages/sign-up';
import { MapComponent } from './components/MapComponent';
import { AddToDatabase } from './pages/addToDatabase'; 
import {Homer} from './components/addObject';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/About-Us" exact element={<AboutUs />} />
          <Route path="/Sign-Up" exact element={<AuthPage />} />
          <Route path="/Map" exact element={<MapComponent />} />
          <Route path="/Add" exact element={<AddToDatabase />} />
          <Route path="/Add-Data" exact element={<Homer/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
