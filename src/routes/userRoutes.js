const express = require("express");
const router = express.Router();
const { jwtCheck } = require("../config/auth");
const upload = require("../middleware/upload");
const {
  getAllUsers,
  getUserById,
  getUserBySub,
  uploadUserImage,
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/:id", getUserById);

router.get("/auth/profile", jwtCheck, getUserBySub);
router.post("/:id/image", upload.single("image"), uploadUserImage);

module.exports = router;
