import { Facility } from "../models/facilitySchema.js";

export const createFacility = async (req, res, next) => {
  try {
    const {
      name,
      description,
      location,
      supportedSports,
      amenities,
      photos,
      ownerId,
    } = req.body;

    const facility = new Facility({
      name,
      description,
      location,
      supportedSports,
      amenities,
      photos,
      ownerId,
      status: "pending",
    });

    await facility.save();

    res.status(201).json({ success: true, facility });
  } catch (err) {
    next(err);
  }
};

export const getFacilities = async (req, res, next) => {
  try {
    const facilities = await Facility.find().populate(
      "ownerId",
      "fullName email"
    );
    res.json({ success: true, facilities });
  } catch (err) {
    next(err);
  }
};
