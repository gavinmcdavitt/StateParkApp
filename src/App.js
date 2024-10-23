import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Home} from './pages/home/index';
import {EmailSignIn, GoogleSignIn} from './components/authComponets';
import { AboutUs } from './pages/about-us';
function App() {
  return (
    <div className="App">
      <Router>
        <EmailSignIn/>
        <GoogleSignIn/>
        <Routes>
        <Route path ="/"/>
        <Route path= "/Home" exact element = {<Home/>}/>
        <Route path ="/About-Us" exact element ={<AboutUs/>}/>
        </Routes>
        </Router>
   </div>
  );
}

export default App;
