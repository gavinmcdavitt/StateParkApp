import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Home} from './pages/home/index';
import { AboutUs } from './pages/about-us';
import {AuthPage} from './pages/sign-up';
function App() {
  return (
    <div className="App">
      <Router>
        =
        <Routes>
        <Route path ="/"/>
        <Route path= "/Home" exact element = {<Home/>}/>
        <Route path ="/About-Us" exact element ={<AboutUs/>}/>
        <Route path ="/Sign-Up" exact element ={<AuthPage/>}/>
        </Routes>
        </Router>
   </div>
  );
}

export default App;
