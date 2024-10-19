"use client";

import { useEffect, useState } from "react";

export function Map({ apiKey }: { apiKey: string }) {
  const [origin, setOrigin] = useState(
    "New World Stages, 340 W 50th St, New York, NY 10019"
  );

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setOrigin(`${latitude},${longitude}`);
        },
        (error) => {
          if (error.code === 1) {
            alert(
              "Location access was denied. Please enable location services to use this feature."
            );
          } else if (error.code === 2) {
            alert("Unable to determine your location. Please try again later.");
          } else if (error.code === 3) {
            alert(
              "Location request timed out. Please check your connection and try again."
            );
          } else {
            alert(
              "An unexpected error occurred while trying to get your location."
            );
          }
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <iframe
      src={`https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${origin}&mode=driving&destination=movie+theaters+near+${origin}`}
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      className="w-full aspect-video rounded shadow"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
}
