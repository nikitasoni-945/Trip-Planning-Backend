const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user = await User.create({ name, email, password: hashed, otp });
  await sendEmail(email, "Verify your Email", `Your OTP is ${otp}`);

  res.json({ message: "OTP sent to your email", email });
};

exports.verifyRegister = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  user.isVerified = true;
  user.otp = "";
  await user.save();

  res.json({ message: "Account verified. Please login." });
};

exports.login = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.isVerified) return res.status(400).json({ message: "User not found or not verified" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  await user.save();

  await sendEmail(email, "Login OTP", `Your OTP is ${otp}`);
  res.json({ message: "OTP sent to email", email });
};

exports.verifyLogin = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  user.otp = "";
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
};
