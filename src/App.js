import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Import React hooks
import { Home } from './pages/home/index';
import { AboutUs } from './pages/about-us';
import { AuthPage } from './pages/sign-up';
import { MapComponent } from './components/MapComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ReservationForm } from './pages/reservation';
import { MyReservationPage } from './pages/my-reservation';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/Home" exact element={<Home />} />
          <Route path="/About-Us" exact element={<AboutUs />} />
          <Route path="/Sign-Up" exact element={<AuthPage />} />
          <Route path="/Map" exact element={<MapComponent />} />
          <Route path="/Reservation" exact element={<ReservationForm />} />
          <Route path="/My-Reservation" exact element={<MyReservationPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
