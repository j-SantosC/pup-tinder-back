const express = require("express");
const router = express.Router();
const { jwtCheck } = require("../config/auth");
const upload = require("../middleware/upload");
const {
  getAllUsers,
  getUserById,
  getUserBySub,
  uploadUserImage,
  addDog,
  getUserDogs,
  deleteDog,
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/:id", getUserById);

router.get("/auth/profile", jwtCheck, getUserBySub);
router.post("/:id/image", upload.single("image"), uploadUserImage);

// New dog routes
router.post("/:id/dogs", upload.single("image"), addDog);
router.get("/:id/dogs", getUserDogs);
router.delete("/:id/dogs/:dogId", deleteDog);

module.exports = router;
