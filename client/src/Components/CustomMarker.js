import React from "react";

const CustomMarker = ({ lat, lng }) => (
  <div
    style={{
      width: "30px",
      height: "30px",
      backgroundColor: "red",
      borderRadius: "50%",
      border: "2px solid white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontWeight: "bold",
    }}
  >
    SOS
  </div>
);

export default CustomMarker;
