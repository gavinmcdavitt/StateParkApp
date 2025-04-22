
## To start an application:
```
Git clone git@github.com:gavinmcdavitt/StateParkApp.git
cd StateParkApp
npm install
npm start
```

![image](https://github.com/user-attachments/assets/fa19f353-3171-4c33-aa8d-25b7a1772178)

![image](https://github.com/user-attachments/assets/b07d02c9-6a8b-4ba7-b260-2da8228021d7)

![image](https://github.com/user-attachments/assets/02b3220c-2dba-4e1a-a125-4fbd142fdb72)

![image](https://github.com/user-attachments/assets/f67541eb-adc9-4689-b6f4-99c3cf36ac0d)



# 🏞️ State Park App – Full Documentation

## 📁 App Routing Overview
![image](https://github.com/user-attachments/assets/06bf68fc-5bb4-4206-b6bf-6eaa93591995)

This application uses **React Router v6** with `BrowserRouter` for SPA-style navigation.

| Route Path         | Component              | Description                                 |
|--------------------|------------------------|---------------------------------------------|
| `/` or `/Home`     | `Home`                 | Main landing page                           |
| `/About-Us`        | `AboutUs`              | About the project                           |
| `/Sign-Up`         | `AuthPage`             | Sign up / Login portal                      |
| `/Map`             | `MapComponent`         | Interactive Leaflet-based park map          |
| `/Reservation`     | `ReservationForm`      | Park reservation form                       |
| `/My-Reservation`  | `MyReservationPage`    | User's reservation management               |
| `/report`          | `ParkStatusReportForm` | Submit park status updates                  |

---

## 🗺️ MapComponent Summary
![image](https://github.com/user-attachments/assets/568a869f-2f10-4698-837b-c40f66194ac1)

### 🔧 Features
- **Leaflet-based map** with OpenStreetMap tiles
- Auto-locate user or fallback to URL lat/lon
- Dynamic radius filter (0–50 miles)
- Park icons by status: open, halfway, or closed
- **Spotlight Mode**: focus on one park with 🌟 icon
- Sidebar list of nearby parks with quick actions

### 🔌 Dependencies
- `leaflet`, `geolib`, `react-router-dom`
- Firebase Realtime DB (`getObjects`)

### 🧠 Key State
- `parks`, `filteredParks`, `userLocation`
- `isSpotlightMode`, `spotlightedPark`

### 🛠️ Functions
- `initializeAllMarkers()`, `toggleSpotlight()`
- `clearAllMarkers()`, `filterParksWithinRadius()`

---

## 🔐 Authentication System

### 🔄 AuthPage includes:
1. **EmailSignIn**
   - Sign-up/Login via Firebase email+password
   - Saves to `/users/{uid}` in DB
   - Error messages for weak or duplicate accounts

2. **GoogleSignIn**
   - Firebase popup OAuth
   - Saves `email`, `uid`, `role` to DB

3. **LogoutButton**
   - Calls `signOut()` and redirects home

4. **ErrorPopup**
   - Displays contextual error messages

### 🧱 Firebase Auth Methods
- `createUserWithEmailAndPassword`
- `signInWithEmailAndPassword`
- `signInWithPopup`, `signOut`
- `setPersistence`, `set(ref(db, path))`

---

## 🧰 Firebase Utilities

### 🔧 Core Functions
- `ensureBooleanField()`: sets all `isOpen` to boolean
- `addCapacityToAllObjects()`: random capacity (1–25)
- `addObj()`: add park data to Firebase

### 🏡 Homer Component
- React form to submit park data to DB
- Tracks form state with `useState`
- Required fields: ID, Name, County, Size, Year, Lat/Lng, etc.

---

## 📆 MyReservationPage Summary

- Fetches reservations via:
  - Authenticated user email
  - URL param (`?email=`)
  - Manual entry
- Displays:
  - Park name, reservation name, date/time, guest count, phone
- Conditional UI: depends on auth state
- Redirects and error handles missing/invalid data

---

## 📋 ReservationForm Summary

- Auto-fills:
  - `parkId`, `parkName` from URL
  - `email` from user session
- Stores under `/reservations/{YYYY-MM-DD}`
- Calls `updateCurrentCapacity()` on submit
- Validates guest count and date
- Redirects to `/my-reservations?email=...`

---

## 🛑 ParkStatusReportForm Summary

- Fields:
  - Park name, open/closed checkbox, datetime, email
- Auto-fills from:
  - URL params
  - Authenticated user
- Saves to `/reports/{YYYY-MM-DD}`
- Calls `updateParkStatus(parkName, status)`
- Redirects to `/map` on success

---

## ✅ Usage Notes
- Ensure Firebase is configured correctly (API keys, DB rules)
- Most state managed with `useState` and `useEffect`
- Minimal external CSS (Bootstrap + App.css)

---

## 📦 Dependencies Overview

- `react`, `react-router-dom`, `leaflet`, `geolib`
- `firebase` (auth + realtime database)
- Bootstrap for layout/styling

---

> ✍️ _Last updated: April 2025_
