const User = require("../models/User.js");
const cloudinary = require("../../cloudinary.js"); // ajusta la ruta según tu estructura
const streamifier = require("streamifier");

// Obtener todos los usuarios
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    console.log("📦 Users found:", users);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Obtener usuario por ID
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const getUserBySub = async (req, res, next) => {
  try {
    const { sub } = req.auth;

    const user = await User.findOne({ sub });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const uploadUserImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `users/${user._id}`,
            public_id: "profile",
            resource_type: "image",
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    user.imageUrl = result.secure_url;
    await user.save();

    res.json({
      message: "Imagen subida correctamente a Cloudinary",
      imageUrl: result.secure_url,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Error al subir imagen a Cloudinary" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserBySub,
  uploadUserImage,
};
