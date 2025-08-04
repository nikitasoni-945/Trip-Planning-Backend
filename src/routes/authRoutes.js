const express = require("express");
const router = express.Router();
const { register, verifyRegister, login, verifyLogin } = require("../controllers/authController");

router.post("/register", register);
router.post("/verify-register", verifyRegister);
router.post("/login", login);
router.post("/verify-login", verifyLogin);

module.exports = router;
