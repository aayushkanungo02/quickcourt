import express from "express";
import {
  createCourt,
  getCourtsByFacility,
  updateCourt,
  deleteCourt,
} from "../controllers/courtController.js";

const router = express.Router();

router.post("/", createCourt);
router.get("/:facilityId", getCourtsByFacility);
router.put("/:courtId", updateCourt);
router.delete("/:courtId", deleteCourt);

export default router;
