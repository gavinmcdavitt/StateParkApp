document.addEventListener('DOMContentLoaded', function () {
    let sliderValue = 50;
    const mapRef = L.map('map').setView([30.43, -84.28], 14); // Default lat/lon for the map center

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef);

    const circleRef = L.circle([30.43, -84.28], {
        color: 'white',
        fillOpacity: 0.2,
        radius: sliderValue * 1609.34
    }).addTo(mapRef);

    // Function to add markers to the map
    function addMarker(latitude, longitude, popupText = '', iconUrl = 'leaf-red.png') {
        const marker = L.marker([latitude, longitude]).addTo(mapRef);
        const icon = L.icon({
            iconUrl: iconUrl,
            iconSize: [38, 95],
            iconAnchor: [22, 94]
        });

        marker.setIcon(icon);
        marker.bindPopup(`<p>${popupText}</p>`);
    }

    // Function to update slider value and circle radius
    function handleSliderChange(event) {
        sliderValue = parseInt(event.target.value, 10);
        circleRef.setRadius(sliderValue * 1609.34); // Update radius based on slider
        console.log('Slider value:', sliderValue);
    }

    // Example of adding a marker for a park
    addMarker(30.44, -84.28, 'Test Park');

    // Fetch parks data from the API (mock data here)
    function fetchParksData() {
        // Example static data (replace with your actual API calls)
        const parks = [
            { latitude: 30.45, longitude: -84.3, name: 'Park A' },
            { latitude: 30.46, longitude: -84.35, name: 'Park B' }
        ];
        parks.forEach(park => {
            addMarker(park.latitude, park.longitude, park.name);
        });
    }

    fetchParksData(); // Initial data fetch

    // Slider input handling
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 1;
    slider.max = 100;
    slider.value = sliderValue;
    slider.style.position = 'absolute';
    slider.style.bottom = '80px';
    slider.style.left = '20px';
    slider.addEventListener('input', handleSliderChange);
    document.body.appendChild(slider);

    // Toggle park list visibility (simple placeholder)
    let isParkListVisible = false;
    const toggleButton = document.getElementById('toggleParkList');
    toggleButton.addEventListener('click', () => {
        isParkListVisible = !isParkListVisible;
        alert(isParkListVisible ? 'Park list visible' : 'Park list hidden');
    });
});
