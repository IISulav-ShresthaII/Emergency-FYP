import React, { useEffect, useState } from "react";

function MapComponent({ locations }) {
  useEffect(() => {
    const initMap = (latitude, longitude) => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: latitude, lng: longitude },
        zoom: 8,
      });

      // Create markers for each location
      locations.forEach((location) => {
        new window.google.maps.Marker({
          position: { lat: location.latitude, lng: location.longitude },
          map: map,
        });
      });
    };

    // Dynamically load Google Maps API script
    const googleMapsScript = document.createElement("script");
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBwTN8VNLAfwlJ67FNjrVixdvCFZsCHvsI&libraries=places`;
    googleMapsScript.async = true;
    document.body.appendChild(googleMapsScript);

    googleMapsScript.onload = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            initMap(position.coords.latitude, position.coords.longitude);
          },
          () => {
            // Default to some location if user denies geolocation
            initMap(34.0522, -118.2437); // Los Angeles coordinates as fallback
          }
        );
      } else {
        // Geolocation is not supported by this browser
        initMap(34.0522, -118.2437); // Los Angeles coordinates
      }
    };

    // Cleanup function to remove the script
    return () => {
      if (googleMapsScript.parentNode) {
        document.body.removeChild(googleMapsScript);
      }
    };
  }, [locations]);

  return <div id="map" style={{ height: "400px", width: "800px" }}></div>;
}

function App() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Fetch data from your API endpoint
    fetch("http://localhost:4000/items")
      .then((response) => response.json())
      .then((data) => {
        setLocations(
          data.items.map((item) => ({
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
          }))
        );
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>Map with Markers</h1>
      <MapComponent locations={locations} />
    </div>
  );
}
export { MapComponent };

export default App;
