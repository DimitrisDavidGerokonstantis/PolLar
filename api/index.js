import express from "express";
import participantRoutes from "./routes/participant.js";
import adminRoutes from "./routes/admin.js";
import commonRoutes from "./routes/common.js";
import cors from "cors";
import axios from "axios";

//import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();

const corsOptions = {
  origin: [
    "https://pollar-app.onrender.com",
    "http://localhost:4200",
    "https://pollar-app2024.web.app",
    "https://pollar-server.onrender.com"
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

//app.use(cors({origin: ["http://localhost:3000","https://pollar-dzrh.onrender.com"]}));
app.use(express.json());
//app.use(cookieParser());

app.use("/api/participant", participantRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/common", commonRoutes);

app.listen(5000, () => {
  console.log("Connected!");
  setInterval(async () => {
    try {
      await axios.get("https://pollar-api-rxlv.onrender.com/api/common/test");
      console.log("TEST!");
    } catch (error) {
      console.error("TEST failed", error.message);
    }
  }, 250000);
});
