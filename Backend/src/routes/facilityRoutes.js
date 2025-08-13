import express from "express";
import {
  createFacility,
  getFacilities,
} from "../controllers/facilitiesController.js";

const router = express.Router();

router.post("/", createFacility);
router.get("/", getFacilities);

export default router;

import mongodb from "mongoose";
