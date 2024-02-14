import React from "react";
import "./LoadingSpinner.scss";

export default function LoadingSpinner({ state }) {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
      <h6>{state}</h6>
    </div>
  );
}
