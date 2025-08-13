import mongoose from "mongoose";
import dotenv from "dotenv";
import { Facility } from "../models/facilitySchema.js";
import { Court } from "../models/courtSchema.js";

dotenv.config();

const samplePricesBySport = {
  Badminton: [300, 400, 500],
  Tennis: [500, 700, 900],
  Football: [1200, 1500, 1800],
  Cricket: [1000, 1300, 1600],
  Hockey: [900, 1100, 1400],
  "Table Tennis": [200, 300, 400],
};

const pickPrice = (sport) => {
  const list = samplePricesBySport[sport] || [500, 700, 900];
  return list[Math.floor(Math.random() * list.length)];
};

const seedCourts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const facilities = await Facility.find({}).exec();
    console.log(`Found ${facilities.length} facilities`);

    let createdCount = 0;

    for (const facility of facilities) {
      const sports = facility.supportedSports || [];
      for (const sport of sports) {
        // Check if a court for this sport already exists for this facility
        const existing = await Court.findOne({
          facilityId: facility._id,
          sportType: sport,
        }).exec();
        if (existing) continue;

        const courtName = `${sport} Court 1`;
        const court = await Court.create({
          facilityId: facility._id,
          name: courtName,
          sportType: sport,
          pricePerHour: pickPrice(sport),
          operatingHours: { start: "06:00", end: "22:00" },
        });
        createdCount += 1;
        console.log(
          `Created court: ${court.name} | Sport: ${sport} | Price: ₹${court.pricePerHour} | Facility: ${facility.name}`
        );
      }
    }

    console.log(`Seeding courts completed. Created ${createdCount} courts.`);
    process.exit(0);
  } catch (err) {
    console.error("Court seeding failed:", err);
    process.exit(1);
  }
};

seedCourts();
