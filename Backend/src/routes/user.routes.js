import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import {
  getVenues,
  getSingleVenue,
  createReview,
  createBooking,
  getMyBookings,
  cancelBooking,
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
} from "../controllers/user.controllers.js";

const router = express.Router();

// Public: Venues
router.get("/venues", getVenues);
router.get("/venues/:venueId", getSingleVenue);

// Protected: Bookings and Profile
router.use(protect);
// Reviews
router.post("/venues/:venueId/reviews", createReview);
router.post("/bookings", createBooking);
router.get("/bookings", getMyBookings);
router.patch("/bookings/:bookingId/cancel", cancelBooking);
router.get("/me", getMyProfile);
router.patch("/me", updateMyProfile);
router.patch("/me/password", changeMyPassword);

// Owner: Facilities CRUD (basic create/update for UI needs)
router.get("/owner/facilities", async (req, res) => {
  try {
    const { Facility } = await import("../models/facilitySchema.js");
    const facilities = await Facility.find({ ownerId: req.user._id })
      .sort({ createdAt: -1 })
      .exec();
    return res.json({ success: true, data: facilities });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

router.post(
  "/owner/facilities",
  upload.array("photos", 3),
  async (req, res) => {
    try {
      const { Facility } = await import("../models/facilitySchema.js");
      const body = req.body || {};
      const name = body.name?.trim();
      const description = body.description?.trim();
      
      // Extract location data from flat format
      const address = body.address || "";
      const city = body.city || "";
      const state = body.state || "";
      const zip = body.zip || "";
      
      const supportedSports = body.supportedSports;
      const amenities = body.amenities;
      
      // Debug logging (remove in production)
      console.log("Received facility data:", {
        name,
        description,
        address,
        city,
        state,
        zip,
        supportedSports,
        amenities
      });

      if (!name || !description) {
        return res.status(400).json({
          success: false,
          message: "Name and description are required",
        });
      }
      
      // Check if any location field is missing
      if (!address || !city || !state || !zip) {
        return res.status(400).json({
          success: false,
          message: `Location fields are required. Received: address="${address}", city="${city}", state="${state}", zip="${zip}"`,
        });
      }

      const photoUrls = (req.files || []).map((f) => f.path).slice(0, 3);
      let sports = [];
      try {
        if (supportedSports) {
          sports = Array.isArray(supportedSports)
            ? supportedSports
            : JSON.parse(supportedSports);
        }
      } catch {
        sports = String(supportedSports)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      let amen = [];
      try {
        if (amenities) {
          amen = Array.isArray(amenities) ? amenities : JSON.parse(amenities);
        }
      } catch {
        amen = String(amenities)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      const doc = await Facility.create({
        name,
        description,
        location: { address, city, state, zip },
        ownerId: req.user._id,
        supportedSports: sports,
        amenities: amen,
        photos: photoUrls,
        status: "approved",
      });
      return res.status(201).json({
        success: true,
        message: "Facility added successfully",
        data: doc,
      });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

router.put(
  "/owner/facilities/:id",
  upload.array("photos", 3),
  async (req, res) => {
    try {
      const { Facility } = await import("../models/facilitySchema.js");
      const { id } = req.params;
      const updates = {};
      if (req.body.supportedSports)
        updates.supportedSports = JSON.parse(req.body.supportedSports);
      if (req.body.amenities)
        updates.amenities = JSON.parse(req.body.amenities);
      if (req.files && req.files.length > 0)
        updates.photos = req.files.map((f) => f.path).slice(0, 3);

      const updated = await Facility.findOneAndUpdate(
        { _id: id, ownerId: req.user._id },
        { $set: updates },
        { new: true }
      ).exec();
      if (!updated)
        return res
          .status(404)
          .json({ success: false, message: "Facility not found" });
      return res.json({
        success: true,
        message: "Facility updated successfully",
        data: updated,
      });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// Owner Dashboard endpoint
router.get("/owner/dashboard", async (req, res) => {
  try {
    const { Facility } = await import("../models/facilitySchema.js");
    const { Booking } = await import("../models/bookingschema.js");
    const { Court } = await import("../models/courtSchema.js");

    // Get all facilities owned by the current user
    const facilities = await Facility.find({ ownerId: req.user._id }).exec();
    const facilityIds = facilities.map(f => f._id);

    // Get total bookings for all facilities owned by this user
    const totalBookings = await Booking.countDocuments({
      facilityId: { $in: facilityIds }
    }).exec();

    // Get active courts (courts that belong to facilities owned by this user)
    const activeCourts = await Court.countDocuments({
      facilityId: { $in: facilityIds }
    }).exec();

    // Calculate earnings from all bookings
    const earningsData = await Booking.aggregate([
      { $match: { facilityId: { $in: facilityIds } } },
      { $group: { _id: null, totalEarnings: { $sum: "$totalPrice" } } }
    ]);
    const earnings = earningsData.length > 0 ? earningsData[0].totalEarnings : 0;

    // Get dates with bookings for this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const monthlyBookings = await Booking.find({
      facilityId: { $in: facilityIds },
      startTime: { $gte: startOfMonth, $lte: endOfMonth }
    }).exec();

    const datesWithBookings = [...new Set(
      monthlyBookings.map(booking => 
        booking.startTime.toISOString().split('T')[0]
      )
    )];

    return res.json({
      success: true,
      data: {
        totalBookings,
        activeCourts,
        earnings,
        datesWithBookings
      }
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// Owner: Courts CRUD operations
router.get("/owner/courts", async (req, res) => {
  try {
    const { Court } = await import("../models/courtSchema.js");
    const { facilityId, facilityIds } = req.query;

    let query = {};
    
    if (facilityId && facilityId !== "all") {
      // Get courts for a specific facility
      query.facilityId = facilityId;
    } else if (facilityIds) {
      // Get courts for multiple facilities (comma-separated IDs)
      const ids = facilityIds.split(",").filter(Boolean);
      if (ids.length > 0) {
        query.facilityId = { $in: ids };
      }
    }

    // If no specific facility filter, get all courts for facilities owned by the user
    if (Object.keys(query).length === 0) {
      const { Facility } = await import("../models/facilitySchema.js");
      const facilities = await Facility.find({ ownerId: req.user._id }).exec();
      const facilityIds = facilities.map(f => f._id);
      if (facilityIds.length > 0) {
        query.facilityId = { $in: facilityIds };
      }
    }

    const courts = await Court.find(query)
      .populate("facilityId", "name")
      .sort({ createdAt: -1 })
      .exec();

    return res.json({
      success: true,
      data: courts
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

router.post("/owner/courts", async (req, res) => {
  try {
    const { Court } = await import("../models/courtSchema.js");
    const { Facility } = await import("../models/facilitySchema.js");
    
    const { facilityId, name, sportType, pricePerHour, operatingHours } = req.body;

    // Validate required fields
    if (!facilityId || !name || !sportType || !pricePerHour || !operatingHours) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Verify that the facility belongs to the current user
    const facility = await Facility.findOne({ 
      _id: facilityId, 
      ownerId: req.user._id 
    }).exec();

    if (!facility) {
      return res.status(403).json({
        success: false,
        message: "Facility not found or access denied"
      });
    }

    // Create the court
    const court = await Court.create({
      facilityId,
      name: name.trim(),
      sportType: sportType.trim(),
      pricePerHour: Number(pricePerHour),
      operatingHours: {
        start: operatingHours.start,
        end: operatingHours.end
      }
    });

    return res.status(201).json({
      success: true,
      message: "Court added successfully",
      data: court
    });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

router.put("/owner/courts/:id", async (req, res) => {
  try {
    const { Court } = await import("../models/courtSchema.js");
    const { id } = req.params;
    const { name, sportType, pricePerHour, operatingHours } = req.body;

    // Validate required fields
    if (!name || !sportType || !pricePerHour || !operatingHours) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Find and update the court, ensuring it belongs to a facility owned by the current user
    const court = await Court.findOneAndUpdate(
      { 
        _id: id,
        facilityId: { $in: await getFacilityIdsForUser(req.user._id) }
      },
      {
        name: name.trim(),
        sportType: sportType.trim(),
        pricePerHour: Number(pricePerHour),
        operatingHours: {
          start: operatingHours.start,
          end: operatingHours.end
        }
      },
      { new: true }
    ).exec();

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found or access denied"
      });
    }

    return res.json({
      success: true,
      message: "Court updated successfully",
      data: court
    });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

router.delete("/owner/courts/:id", async (req, res) => {
  try {
    const { Court } = await import("../models/courtSchema.js");
    const { id } = req.params;

    // Find and delete the court, ensuring it belongs to a facility owned by the current user
    const court = await Court.findOneAndDelete({
      _id: id,
      facilityId: { $in: await getFacilityIdsForUser(req.user._id) }
    }).exec();

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found or access denied"
      });
    }

    return res.json({
      success: true,
      message: "Court deleted successfully"
    });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

// Helper function to get facility IDs for a user
async function getFacilityIdsForUser(userId) {
  const { Facility } = await import("../models/facilitySchema.js");
  const facilities = await Facility.find({ ownerId: userId }).exec();
  return facilities.map(f => f._id);
}

export default router;
