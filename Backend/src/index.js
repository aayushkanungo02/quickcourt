import express from "express";
import dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/user.routes.js";
import paymentRoutes from "./routes/payments.routes.js";
import facilityRoutes from "./routes/facilityRoutes.js";
import courtRoutes from "./routes/courtRoutes.js";
// import venueRoutes from "./routes/venueRoutes.js";
// import courtRoutes from "./routes/courtRoutes.js";
// import bookingRoutes from "./routes/bookingRoutes.js";
// import reviewRoutes from "./routes/reviewRoutes.js";

// Load env from Backend/.env by default, also try project-root .env for flexibility
dotenv.config();
try {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  // Backend root .env (../ since file is in src/)
  dotenv.config({ path: resolve(__dirname, "..", ".env") });
  // Project root .env
  dotenv.config({ path: resolve(__dirname, "../..", ".env") });
} catch {}
const app = express();
const PORT = process.env.PORT || 4001;


app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/facilities", facilityRoutes);

app.use("/api/courts", courtRoutes);
// app.use("/api/venues", venueRoutes);
// app.use("/api/courts", courtRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/reviews", reviewRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

// Routes
