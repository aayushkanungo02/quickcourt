import mongoose from "mongoose";
import dotenv from "dotenv";
import { Facility } from "../models/facilitySchema.js";

dotenv.config();

const sampleFacilities = [
  {
    name: "Downtown Badminton Court",
    description:
      "A premium badminton facility located in the heart of the city. Features professional-grade courts with excellent lighting and ventilation.",
    location: {
      address: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400001",
    },
    ownerId: new mongoose.Types.ObjectId(), // Generate a new ObjectId
    supportedSports: ["Badminton", "Table Tennis"],
    amenities: [
      "Parking",
      "Changing Rooms",
      "Equipment Rental",
      "Water Dispenser",
    ],
    photos: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
    ],
    status: "approved",
  },
  {
    name: "Green Park Turf",
    description:
      "Professional football and cricket turf with multiple grounds. Perfect for tournaments and practice sessions.",
    location: {
      address: "456 Park Avenue",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400002",
    },
    ownerId: new mongoose.Types.ObjectId(),
    supportedSports: ["Football", "Cricket", "Hockey"],
    amenities: ["Floodlights", "Parking", "Refreshment Area", "First Aid Kit"],
    photos: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    ],
    status: "approved",
  },
  {
    name: "Elite Tennis Academy",
    description:
      "World-class tennis courts with professional coaching available. Features both indoor and outdoor courts.",
    location: {
      address: "789 Sports Complex",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400003",
    },
    ownerId: new mongoose.Types.ObjectId(),
    supportedSports: ["Tennis"],
    amenities: [
      "Professional Coaches",
      "Equipment Shop",
      "Café",
      "Locker Rooms",
    ],
    photos: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop",
    ],
    status: "approved",
  },
];

const seedFacilities = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing facilities
    await Facility.deleteMany({});
    console.log("Cleared existing facilities");

    // Insert sample facilities
    const insertedFacilities = await Facility.insertMany(sampleFacilities);
    console.log(`Inserted ${insertedFacilities.length} facilities`);

    // Display the created facilities with their IDs
    insertedFacilities.forEach((facility) => {
      console.log(`Facility: ${facility.name} - ID: ${facility._id}`);
    });

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedFacilities();
