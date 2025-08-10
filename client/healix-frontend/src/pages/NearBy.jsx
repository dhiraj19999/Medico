import React, { useEffect, useState } from "react";
import axiosInstance from "../api/Api.js";

import {
  FaHospital,
  FaPrescriptionBottleAlt,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

// Simple reusable Skeleton component with shimmer animation
const Skeleton = ({ className }) => (
  <div
    className={`bg-gray-300 animate-pulse rounded ${className}`}
  />
);

const Nearby = () => {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => setError("Failed to get location: " + err.message)
    );
  }, []);

  useEffect(() => {
    if (!location) return;
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.post("/nearby", {
          latitude: location.lat,
          longitude: location.lon,
        });
        setPlaces(res.data.places);
        console.log("Nearby Places:", res.data.places);
      } catch (err) {
        setError("Error fetching places.");
      }
      setLoading(false);
    };
    fetchPlaces();
  }, [location]);

  const filteredPlaces = places.filter((p) => {
    if (filter !== "all" && p.amenity !== filter) return false;
    if (!p.name || p.name === "N/A") return false;
    const addr = p.address || {};
    const hasAddress =
      addr.full ||
      addr.housenumber ||
      addr.street ||
      addr.city ||
      addr.district ||
      addr.state ||
      addr.postcode;
    if (!hasAddress) return false;
    return true;
  });

  // Number of skeleton cards to show while loading
  const skeletonCount = 6;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900">
        Nearby Hospitals & Pharmacies
      </h1>

      {/* Filters */}
      <div className="flex justify-center mb-10 space-x-5">
        {loading
          ? // Skeleton placeholders for filter buttons
            [1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="w-24 h-10 rounded-full"
              />
            ))
          : ["all", "hospital", "pharmacy"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2 rounded-full font-medium text-lg transition-colors duration-300 focus:outline-none shadow-sm
              ${
                filter === type
                  ? "bg-teal-600 text-white shadow-blue-400"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-teal-700"
              }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
      </div>

      {/* Loading/Error */}
      {error && (
        <p className="text-center text-red-600 font-semibold text-lg">{error}</p>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading
          ? // Skeleton cards placeholders
            Array.from({ length: skeletonCount }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
              >
                {/* Image skeleton */}
                <Skeleton className="h-48 w-full rounded-t-xl" />
                {/* Content skeleton */}
                <div className="p-5 flex flex-col justify-between h-48 space-y-4">
                  <Skeleton className="h-8 w-3/4 rounded" />
                  <Skeleton className="h-6 w-1/2 rounded" />
                  <Skeleton className="h-6 w-full rounded" />
                  <Skeleton className="h-6 w-2/3 rounded" />
                </div>
              </div>
            ))
          : filteredPlaces.length === 0 && !loading ? (
              <p className="col-span-full text-center text-gray-500 text-lg">
                No places found.
              </p>
            ) : (
              filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                >
                  {/* Image */}
                  <div className="h-48 w-full overflow-hidden rounded-t-xl">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col justify-between h-48">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
                          <span>{place.name}</span>
                          {place.amenity === "hospital" ? (
                            <FaHospital className="text-red-600" size={20} />
                          ) : (
                            <FaPrescriptionBottleAlt className="text-green-600" size={20} />
                          )}
                        </h2>
                        <span className="text-sm text-gray-500 italic">{place.distance}</span>
                      </div>

                      {/* Phone */}
                      <p className="flex items-center space-x-2 text-gray-700 mb-2 text-lg">
                        <FaPhone className="text-blue-600" />
                        {place.phone && place.phone !== "N/A" ? (
                          <a href={`tel:${place.phone}`} className="hover:underline">
                            {place.phone}
                          </a>
                        ) : (
                          <span>N/A</span>
                        )}
                      </p>

                      {/* Address */}
                      <p className="flex items-start space-x-2 text-gray-600 text-md">
                        <FaMapMarkerAlt className="mt-1 text-red-500" />
                        <span>
                          {place.address?.full ||
                            [
                              place.address?.housenumber,
                              place.address?.street,
                              place.address?.city,
                              place.address?.district,
                              place.address?.state,
                              place.address?.postcode,
                            ]
                              .filter(Boolean)
                              .join(", ") || "Address not available"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
      </div>
    </div>
  );
};

export default Nearby;

