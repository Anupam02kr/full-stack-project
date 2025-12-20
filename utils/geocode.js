async function geocode(place) {
  try {
    const url =
      "https://nominatim.openstreetmap.org/search" +
      `?format=json&q=${encodeURIComponent(place)}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "WanderLustApp/1.0 (student-project)"
      }
    });

    const data = await res.json();

    if (!data || data.length === 0) {
      return null;
    }

    return {
      lat: Number(data[0].lat),
      lng: Number(data[0].lon)
    };
  } catch (err) {
    console.error("Geocoding error:", err.message);
    return null;
  }
}

module.exports = geocode;
