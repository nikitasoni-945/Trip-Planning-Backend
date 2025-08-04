const express = require("express");
const router = express.Router();
const { planTrip } = require("../controllers/tripController");
const protect = require("../middleware/authmiddleware");

router.post("/plan", protect, planTrip);

module.exports = router;
