import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Import React hooks
import { Home } from './pages/home/index';
import { AboutUs } from './pages/about-us';
import { AuthPage } from './pages/sign-up';
import { MapComponent } from './components/MapComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ReservationForm } from './pages/reservation';
import { MyReservationPage } from './pages/my-reservation';
import ZeroDBScheduled from './components/cleanDB';
function App() {
  ZeroDBScheduled();
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/Home" exact element={<Home />} />
          <Route path="/about-Us" exact element={<AboutUs />} />
          <Route path="/sign-Up" exact element={<AuthPage />} />
          <Route path="/map" exact element={<MapComponent />} />
          <Route path="/reservation" exact element={<ReservationForm />} />
          <Route path="/my-reservation" exact element={<MyReservationPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
