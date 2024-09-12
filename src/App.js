import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth } from './pages/auth/index';
import {Home} from './pages/home/index';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path ="/" exact element ={<Auth />}/>
        <Route path= "/Home" exact element = {<Home/>}/>
        </Routes>
        </Router>
   </div>
  );
}

export default App;
