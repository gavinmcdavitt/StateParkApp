import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Home} from './pages/home/index';
import { AboutUs } from './pages/about-us';
import {AuthPage} from './pages/sign-up';
import {MapComponent} from './components/MapComponent';
//import { Map } from './pages/map';
function App() {
  return (
    <div className="App">
      <Router>
        
        <Routes>
        <Route path= "/" exact element = {<Home/>}/>
        <Route path ="/About-Us" exact element ={<AboutUs/>}/>
        <Route path ="/Sign-Up" exact element ={<AuthPage/>}/>
        <Route path ="/Map" exact element ={<MapComponent/>}/>

        </Routes>
        </Router>
   </div>
  );
}

export default App;
