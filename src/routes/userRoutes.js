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
  updateUser,
  createUser,
} = require("../controllers/userController");
const {
  getDogsForMatching,
  markDogAsSeen,
} = require("../controllers/matchController");

router.get("/", getAllUsers);

router.get("/auth/profile", jwtCheck, getUserBySub);

router.get("/match", jwtCheck, getDogsForMatching);
router.post("/seen", jwtCheck, markDogAsSeen);

router.get("/:id", getUserById);

//User
router.post("/", jwtCheck, createUser);
router.put("/:id", jwtCheck, updateUser);
router.post("/:id/image", upload.single("image"), uploadUserImage);

// New dog routes
router.post("/:id/dogs", upload.single("image"), addDog);
router.get("/:id/dogs", getUserDogs);
router.delete("/:id/dogs/:dogId", deleteDog);

module.exports = router;
