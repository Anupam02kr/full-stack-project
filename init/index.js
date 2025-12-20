const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const geocode = require("../utils/geocode"); // 👈 geocode utility

// 1️⃣ Connect to MongoDB
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// 2️⃣ Seed database with geocoding
const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Old listings deleted");

    const dataWithOwner = await Promise.all(
      initData.data.map(async (obj) => {
        const coor = await geocode(obj.location);

        // ❗ Safety check (prevents crash)
        if (!coor) {
          console.log("Geocode failed for:", obj.location);
          return null;
        }

        return {
          ...obj,
          owner: '694176ee1ffde56d2d4d58ed',
          geometry: {
            type: "Point",
            coordinates: [coor.lng, coor.lat], // lng first
          }
        };
      })
    );

    // remove failed entries
    const filteredData = dataWithOwner.filter(Boolean);

    await Listing.insertMany(filteredData);
    console.log("Database initialized with sample data");
  } catch (err) {
    console.error("Error while seeding DB:", err);
  } finally {
    mongoose.connection.close();
  }
};

initDB();
