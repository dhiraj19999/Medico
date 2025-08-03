import axios from "axios";

export const findNearby = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const radius = 40000; // 40 km

    const query = `
[out:json];
(
  node(around:${radius},${latitude},${longitude})["amenity"~"hospital|pharmacy"];
  way(around:${radius},${latitude},${longitude})["amenity"~"hospital|pharmacy"];
  relation(around:${radius},${latitude},${longitude})["amenity"~"hospital|pharmacy"];
);
out center tags;
`;

    const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
      headers: { "Content-Type": "text/plain" }
    });

    const defaultHospitalImg = "https://cdn-icons-png.flaticon.com/512/2967/2967350.png";
    const defaultPharmacyImg = "https://cdn-icons-png.flaticon.com/512/3063/3063826.png";

    // Haversine formula for distance (in km)
    const haversine = (lat1, lon1, lat2, lon2) => {
      const toRad = v => (v * Math.PI) / 180;
      const R = 6371;
      const φ1 = toRad(lat1), φ2 = toRad(lat2);
      const Δφ = toRad(lat2 - lat1), Δλ = toRad(lon2 - lon1);
      const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const places = response.data.elements.map(el => {
      const lat = el.lat || el.center?.lat;
      const lon = el.lon || el.center?.lon;
      const tags = el.tags || {};
      const type = tags.amenity || "unknown";
      const distance = haversine(latitude, longitude, lat, lon);

      return {
        id: el.id,
        type,
        name: tags.name || "N/A",
        phone: tags.phone || tags["contact:phone"] || el.id || "N/A",
        website: tags.website || null,
        amenity:tags.amenity || null,
        lat,
        lon,
        image: type === "hospital" ? defaultHospitalImg : defaultPharmacyImg,
        distance: `${distance.toFixed(2)} km`,
        address: {
          full: tags["addr:full"] || null,
          street: tags["addr:street"] || null,
          housenumber: tags["addr:housenumber"] || null,
          city: tags["addr:city"] || tags["addr:town"] || tags["addr:village"] || null,
          district: tags["addr:district"] || null,
          state: tags["addr:state"] || null,
          postcode: tags["addr:postcode"] || null,
          
        },
        source: tags.source || null
      };
    });

    // Filter places only within 40 km
    const filtered = places.filter(p => parseFloat(p.distance) <= 40);

    res.json({ places: filtered });

  } catch (error) {
    console.error("Nearby Finder Error:", error.message);
    res.status(500).json({ error: "Failed to fetch nearby places." });
  }
};
