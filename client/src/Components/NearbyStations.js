// AIzaSyBwTN8VNLAfwlJ67FNjrVixdvCFZsCHvsI
import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const PoliceStation = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [policeStationLocations, setPoliceStationLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);

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
          type: "police",
        };

        const service = new window.google.maps.places.PlacesService(
          document.createElement("div")
        );

        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSelectedLocation(null);
            setPoliceStationLocations(results);
          }
        });
      });
    }
  };

  const handlePlaceSelect = () => {};

  const openInGoogleMaps = (lat, lng) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank"
    );
  };

  const handleDirections = (destination) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Directions request failed due to ${status}`);
        }
      }
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
          height: "600px",
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
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "road",
              elementType: "labels",
              stylers: [{ visibility: "off" }], // Hide road labels
            },
          ],
        }}
      >
        {policeStationLocations.map((policeStation, index) => (
          <Marker
            key={index}
            position={{
              lat: policeStation.geometry.location.lat(),
              lng: policeStation.geometry.location.lng(),
            }}
            onClick={() => {
              setSelectedLocation(policeStation);
              handleDirections(policeStation.geometry.location);
            }}
          >
            {selectedLocation === policeStation && (
              <InfoWindow onCloseClick={() => setSelectedLocation(null)}>
                <div style={{ maxWidth: "120px" }}>
                  <h3>{policeStation.name}</h3>
                  <p>{policeStation.vicinity}</p>
                  {policeStation.formatted_phone_number && (
                    <p>Contact: {policeStation.formatted_phone_number}</p>
                  )}
                  <button
                    onClick={() =>
                      openInGoogleMaps(
                        policeStation.geometry.location.lat(),
                        policeStation.geometry.location.lng()
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
        {directions && <DirectionsRenderer directions={directions} />}
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

export default PoliceStation;
