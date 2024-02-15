import express from "express";
import {
  login,
  pollStatus,
  postSuggestion,
  getSuggestions,
  updateSuggestion,
  getSuggestionsVote,
  makeVote,
  getVotes,
  deleteVotes,
  getResults,
  getPollPhase,
  getPollTitle,
} from "../controllers/participant.js";

const router = express.Router();

router.post("/login", login);
router.post("/pollStatus", pollStatus);
router.post("/postSuggestion", postSuggestion);
router.get("/getSuggestions/:uid/:pwd", getSuggestions);
router.put("/updateSuggestion", updateSuggestion);
router.get("/getSuggestionsVote/:uid/:password/:rank/", getSuggestionsVote);
router.post("/makeVote", makeVote);
router.get("/getVotes/:uid/:pwd", getVotes);
router.delete("/deleteVotes/:uid", deleteVotes);
router.get("/getResults/:uid/:pwd/", getResults);
router.get("/getPollPhase/:pwd/", getPollPhase);
router.get("/getPollTitle/:pwd/", getPollTitle);
export default router;
