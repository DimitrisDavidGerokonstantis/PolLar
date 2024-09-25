import express from "express";
import { pollStatusGeneral, test } from "../controllers/common.js";

const router = express.Router();

router.post("/pollStatus", pollStatusGeneral);
router.get("/test", test);

export default router;
