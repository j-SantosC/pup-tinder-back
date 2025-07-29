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
} = require("../controllers/userController");
const { getDogsForMatching } = require("../controllers/matchController");

router.get("/", getAllUsers);

//Auth - DEBE IR ANTES DE /:id
router.get("/auth/profile", jwtCheck, getUserBySub);

//Match routes - DEBE IR ANTES DE /:id
router.get("/match", jwtCheck, getDogsForMatching);

// Esta ruta con parámetro DEBE IR AL FINAL
router.get("/:id", getUserById);

//User
router.put("/:id", jwtCheck, updateUser);
router.post("/:id/image", upload.single("image"), uploadUserImage);

// New dog routes
router.post("/:id/dogs", upload.single("image"), addDog);
router.get("/:id/dogs", getUserDogs);
router.delete("/:id/dogs/:dogId", deleteDog);

module.exports = router;
