import express from "express";
import {
  createPoll,
  addRanks,
  login,
  getResults,
  upgradePhase,
} from "../controllers/admin.js";

const router = express.Router();

router.post("/createPoll", createPoll);
router.post("/addRanks", addRanks);
router.post("/login", login);

router.post("/upgradePhase", upgradePhase);
router.get("/getResults/:pwd/", getResults);

export default router;
