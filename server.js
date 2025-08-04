const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./src/routes/authRoutes");
const tripRoutes = require("./src/routes/tripRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/trip", tripRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
