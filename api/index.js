import express from "express";
import participantRoutes from "./routes/participant.js";
import adminRoutes from "./routes/admin.js";

//import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();

app.use(express.json());
//app.use(cookieParser());

app.use("/api/participant", participantRoutes);
app.use("/api/admin", adminRoutes);

app.listen(8800, () => {
  console.log("Connected!");
});