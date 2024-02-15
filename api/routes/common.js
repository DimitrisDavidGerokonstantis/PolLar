import express from "express";
import { pollStatusGeneral } from "../controllers/common.js";

const router = express.Router();

router.post("/pollStatus", pollStatusGeneral);

export default router;
