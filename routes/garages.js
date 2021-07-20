import express from "express";
const router = express.Router();

import {
  searchGarage,
  getGarage,
  newGarage,
  rmGarage,
  renameGarage,
} from "../controllers/garageController";

router.get("/", searchGarage);

router.get("/:garageID", getGarage);

router.post("/", newGarage);

router.patch("/:garageId", renameGarage);

router.delete("/:garageID", rmGarage);

export { router as garages };
