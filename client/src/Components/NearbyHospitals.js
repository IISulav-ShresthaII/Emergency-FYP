import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const Map = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [hospitalLocations, setHospitalLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const handleMapClick = (event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleLoad = (map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const userPos = { lat: latitude, lng: longitude };
        setUserLocation(userPos);
        setMapCenter(userPos);

        const request = {
          location: userPos,
          radius: 5000,
          type: "hospital",
        };

        const service = new window.google.maps.places.PlacesService(
          document.createElement("div")
        );

        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSelectedLocation(null);
            setHospitalLocations(results);
          }
        });
      });
    }
  };

  const handlePlaceSelect = () => {
    // You can add code here if needed
  };

  useEffect(() => {
    // You can add code here if needed
  }, [selectedLocation]);

  const openInGoogleMaps = (lat, lng) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBwTN8VNLAfwlJ67FNjrVixdvCFZsCHvsI"
      libraries={["places"]}
    >
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "400px",
        }}
        center={mapCenter}
        zoom={14}
        onClick={handleMapClick}
        onLoad={handleLoad}
        options={{
          disableDefaultUI: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }], // Hide points of interest labels
            },
            {
              featureType: "road",
              elementType: "labels",
              stylers: [{ visibility: "off" }], // Hide road labels
            },
          ],
        }}
      >
        {hospitalLocations.map((hospital, index) => (
          <Marker
            key={index}
            position={{
              lat: hospital.geometry.location.lat(),
              lng: hospital.geometry.location.lng(),
            }}
            onClick={() => setSelectedLocation(hospital)}
          >
            {selectedLocation === hospital && (
              <InfoWindow onCloseClick={() => setSelectedLocation(null)}>
                <div>
                  <h3>{hospital.name}</h3>
                  <p>{hospital.vicinity}</p>
                  <p>Phone: {hospital.formatted_phone_number}</p>
                  <button
                    onClick={() =>
                      openInGoogleMaps(
                        hospital.geometry.location.lat(),
                        hospital.geometry.location.lng()
                      )
                    }
                  >
                    Show on Google Maps
                  </button>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/kml/paddle/wht-circle.png",
              scaledSize: new window.google.maps.Size(45, 45),
            }}
          />
        )}
        <Autocomplete
          onLoad={(autocomplete) => console.log(autocomplete)}
          onPlaceChanged={handlePlaceSelect}
        >
          <input
            type="text"
            placeholder="Enter a location"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "50%",
              marginLeft: "-120px",
            }}
          />
        </Autocomplete>
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
