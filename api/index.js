import express from "express";
import participantRoutes from "./routes/participant.js";
import adminRoutes from "./routes/admin.js";
import cors from "cors";

//import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();

app.use(cors({origin: ["http://localhost:3000","https://pollar-dzrh.onrender.com:3000"]}));

//app.use(cors({origin: ["http://localhost:3000","https://pollar-dzrh.onrender.com"]}));
app.use(express.json());
//app.use(cookieParser());

app.use("/api/participant", participantRoutes);
app.use("/api/admin", adminRoutes);

app.listen(5000, () => {
  console.log("Connected!");
});
