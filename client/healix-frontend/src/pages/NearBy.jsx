import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/Api.js";
import {
  FaHospital,
  FaPrescriptionBottleAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";

// Skeleton Loader
const Skeleton = ({ className }) => (
  <div className={`bg-gray-300 animate-pulse rounded ${className}`} />
);

// Animation CSS
const styles = `
.card-hidden {
  opacity: 0;
  transform: translateY(40px);
}
.card-visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
`;

const Nearby = () => {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchRef = useRef(null);
  const cardsRef = useRef([]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get current location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        setError("Failed to get location: " + err.message);
        setLoading(false);
      }
    );
  }, []);

  // Fetch nearby places
  useEffect(() => {
    if (!location) return;
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.post("/nearby", {
          latitude: location.lat,
          longitude: location.lon,
        });
        setPlaces(res.data.places || []);
      } catch {
        setError("Error fetching places.");
      }
      setLoading(false);
    };
    fetchPlaces();
  }, [location]);

  // Fetch suggestions
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchTerm
          )}&addressdetails=1&limit=5`
        );
        const data = await res.json();
        const formatted = data.map((item) => ({
          name: item.display_name,
          lat: item.lat,
          lon: item.lon,
        }));
        setSuggestions(formatted);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error fetching suggestions", err);
      }
    };
    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Filter logic
  const filteredPlaces = places.filter((p) => {
    if (filter !== "all" && p.amenity !== filter) return false;
    if (!p.name || p.name === "N/A" || "") return false;
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

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("card-visible");
            }, i * 150); // Staggered delay
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach((card) => {
      if (card) {
        card.classList.add("card-hidden");
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, [filteredPlaces]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <style>{styles}</style>

      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-900">
        Nearby Hospitals & Pharmacies
      </h1>

      {/* Search */}
      <div ref={searchRef} className="mb-6 relative max-w-xl mx-auto">
        {loading ? (
          <Skeleton className="h-12 w-full rounded-full" />
        ) : (
          <div className="relative">
            <input
            
              type="text"
              placeholder="Search place..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              className="w-full  border border-gray-300 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm text-lg"
            />
            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
          </div>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-14 left-0 w-full bg-white shadow-lg rounded-lg max-h-64 overflow-y-auto z-10">
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => {
                  setLocation({ lat: parseFloat(s.lat), lon: parseFloat(s.lon) });
                  setSearchTerm(s.name);
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
              >
                <p className="font-medium text-gray-800">{s.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex justify-center mb-10 space-x-5">
        {loading
          ? [1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-24 h-10 rounded-full" />
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

      {/* Error */}
      {error && (
        <p className="text-center text-red-600 font-semibold text-lg">{error}</p>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                <Skeleton className="h-56 w-full rounded-t-2xl" />
                <div className="p-6 flex flex-col items-center space-y-4">
                  <Skeleton className="h-8 w-3/4 rounded" />
                  <Skeleton className="h-6 w-1/2 rounded" />
                  <Skeleton className="h-6 w-full rounded" />
                </div>
              </div>
            ))
          : filteredPlaces.map((place, idx) => (
              <div
                key={place.id}
                ref={(el) => (cardsRef.current[idx] = el)}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]"
              >
                <div className="h-56 w-full overflow-hidden rounded-t-2xl ">
                  <img
                    src={place.image}
                    alt={place.name}
                    className= "w-full h-64 object-contain transition-transform duration-500 hover:scale-105 "
                    loading="lazy"
                  />
                </div>

                <div className="p-6 flex flex-col items-center text-center space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {place.name}
                    {place.amenity === "hospital" ? (
                      <FaHospital className="text-red-600" size={22} />
                    ) : (
                      <FaPrescriptionBottleAlt
                        className="text-green-600"
                        size={22}
                      />
                    )}
                  </h2>

                  <span className="text-sm text-gray-500 italic">
                    {place.distance}
                  </span>

                  <p className="flex items-center gap-2 text-gray-700 text-lg">
                    <FaPhone className="text-blue-600" />
                    {place.phone && place.phone !== "N/A" ? (
                      <a href={`tel:${place.phone}`} className="hover:underline">
                        {place.phone}
                      </a>
                    ) : (
                      <span>N/A</span>
                    )}
                  </p>

                  <p className="flex items-center gap-2 text-gray-600 text-md">
                    <FaMapMarkerAlt className="text-red-500" />
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
                          .join(", ") ||
                        "Address not available"}
                    </span>
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Nearby;
