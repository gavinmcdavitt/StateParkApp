
## To start an application:
```
Git clone git@github.com:gavinmcdavitt/StateParkApp.git
cd StateParkApp
npm install
npm start
```


![alt text](https://github.com/user-attachments/assets/ef4f6b1d-6efe-41dd-9324-e3c4981c4083)
# Codebase Documentation Summary

## MapComponent.js
**Core Function**: Main map interface with Leaflet integration  
**Key Features**:
- Dynamic radius filtering (1-50 mile range)
- Park status visualization (open/half-open/closed icons)
- Spotlight mode for focused park viewing
- User location tracking
- Sliding park list panel
- Reservation/reporting system integration

**Critical Dependencies**:
- `leaflet` + `geolib` for spatial operations
- Firebase Realtime Database via `getObjects`
- React Router for URL params

# Feature Explanations

## 1. Spotlight Mode
**Purpose**: Focused park viewing experience  
**User Interaction**:
- Triggered by ★ button in park popups
- Click "Exit Spotlight" to return to normal view

**Technical Workflow**:
1. Clears all regular markers
2. Displays highlighted marker with spotlight icon (🌟)
3. Shows expanded park details permanently
4. Maintains user location marker
5. Updates filtered parks list to single entry

**Key Benefits**:
- Eliminates visual clutter
- Quick access to reservation/report actions
- Persistent park information display

---

## 2. Make a Reservation
**User Flow**:
1. Click "Go to Reservation" in:
   - Park popup (regular/spotlight modes)
   - Sliding panel park list
2. Redirects to `/reservation` route with parameters:
   - `parkId`: Database identifier
   - `parkName`: Human-readable name
   - `parkLat/parkLong`: Coordinates (reporting only)

**System Integration**:
- Reservation data stored under `reservations` node
- Email-based retrieval via `getReservationsByEmail()`
- Capacity tracking through `updateCurrentCapacity()`

**Capacity Enforcement**:
- Automatic guest count adjustments
- Nightly reset to random 1-5 via `ZeroOutCapacityAndClose()`

---

## 3. Update Park Status
**Two-Tier System**:

### A. Administrative Control
**ParkToggleButton Features**:
- Global open/close toggle
- Bulk update all parks
- Visual feedback (green/red button)
  
**Database Impact**:
```javascript
// Example update payload
{
  "parkId1/isOpen": true,
  "parkId2/isOpen": true,
  // ... all parks
}
---

## ParkToggleButton.js
**Core Function**: Administrative park status control  
**Key Features**:
- Bulk toggle for all park `isOpen` states
- Visual feedback (green/red button states)
- Firebase atomic updates
- Top-right positioning overlay

**Data Impact**: Directly modifies `objects/[park]/isOpen` in DB

---

## firebase-utils.js
**Core Functions**: Database operations layer

### Key Utilities:
1. **Status Management**:
   - `updateParkStatus()`: Single park open/close
   - `setAllParksOpen()`: Mass open parks

2. **Capacity Control**:
   - `updateCurrentCapacity()`: Adjust guest counts
   - `ZeroOutCapacityAndClose()`: Nightly reset to random 1-5

3. **Data Fetching**:
   - `getObjects()`: Real-time park data stream
   - `getReservationsByEmail()`: User-specific bookings

**Database Structure**:
```json
{
  "objects": {
    "parkId": {
      "isOpen": true,
      "currentCapacity": 0,
      "coordinates": {"lat": 30.43, "lng": -84.28}
    }
  },
  "reservations": {
    "Date": {
      "email": "user@domain.com",
      "parkId": "parkId"
    }
  }
}
