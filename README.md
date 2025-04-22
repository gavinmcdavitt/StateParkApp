
## To start an application:
```
Git clone git@github.com:gavinmcdavitt/StateParkApp.git
cd StateParkApp
npm install
npm start
```


![alt text](https://github.com/user-attachments/assets/ef4f6b1d-6efe-41dd-9324-e3c4981c4083)
MapComponent.js

Main Purpose: Interactive map interface using Leaflet.
🔑 Key Features:

    Radius filtering (1–50 miles)

    Park status indicators (open / half-open / closed)

    Spotlight mode for focused viewing

    User geolocation support

    Sliding panel with park list

    Integrated reservation and report functionality

📦 Dependencies:

    leaflet and geolib for spatial ops

    Firebase Realtime DB via getObjects

    React Router for dynamic routing

✨ Feature Explanations
1. Spotlight Mode

Purpose: Highlight a single park for better focus.
👤 User Interaction:

    Click ★ in a park popup

    Exit via "Exit Spotlight" button

⚙️ Workflow:

    Clears all standard markers

    Shows spotlight icon (🌟)

    Locks expanded park detail

    Keeps user location marker active

    Filters park list to that single park

✅ Benefits:

    Reduces visual clutter

    Simplifies park interactions

    Displays persistent, detailed info

2. Make a Reservation
🧭 Flow:

    Click “Go to Reservation” in:

        Park popup

        Sliding panel

    Redirects to /reservation with:

        parkId

        parkName

        parkLat, parkLong (for reporting)

🔄 Backend:

    Saves data under reservations

    Retrieves by email using getReservationsByEmail()

    Tracks capacity with updateCurrentCapacity()

📊 Capacity Rules:

    Auto guest count adjustment

    Nightly reset via ZeroOutCapacityAndClose() (random 1–5)

3. Update Park Status
🔐 Admin Control (via ParkToggleButton)

    Toggle all parks open/closed

    Color indicators (green/red)

    Bulk Firebase updates
