const User = require("../models/User.js");
const cloudinary = require("../../cloudinary.js"); // ajusta la ruta según tu estructura
const streamifier = require("streamifier");

const createUser = async (req, res, next) => {
  try {
    const { sub } = req.auth;
    const { email } = req.body;

    const existingUser = await User.findOne({ sub });
    if (existingUser) {
      return res.status(409).json({ error: "Usuario ya existe" });
    }

    const newUser = new User({
      sub,
      email,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    console.log("📦 Users found:", users);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

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

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, bio, city } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { name, bio, city },
      { new: true, runValidators: true }
    );

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

const addDog = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { name, breed, age } = req.body;

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `users/${user._id}/dogs`,
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

    const newDog = {
      name,
      breed,
      age,
      imageUrl: result.secure_url,
    };

    if (!user.dogs) {
      user.dogs = [];
    }

    user.dogs.push(newDog);
    await user.save();

    res.json({
      message: "Perro agregado correctamente",
      dog: newDog,
    });
  } catch (err) {
    console.error("Add dog error:", err);
    res.status(500).json({ error: "Error al agregar perro" });
  }
};

const getUserDogs = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user.dogs || []);
  } catch (err) {
    console.error("Get dogs error:", err);
    res.status(500).json({ error: "Error al obtener perros" });
  }
};

const deleteDog = async (req, res) => {
  try {
    const { id, dogId } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    user.dogs = user.dogs.filter((dog) => dog._id.toString() !== dogId);
    await user.save();

    res.json({ message: "Perro eliminado correctamente" });
  } catch (err) {
    console.error("Delete dog error:", err);
    res.status(500).json({ error: "Error al eliminar perro" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserBySub,
  uploadUserImage,
  addDog,
  getUserDogs,
  deleteDog,
  updateUser,
  createUser,
};
