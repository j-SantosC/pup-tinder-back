const User = require("../models/User.js");

const getDogsForMatching = async (req, res, next) => {
  try {
    const { sub } = req.auth;

    const currentUser = await User.findOne({ sub });
    if (!currentUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const otherUsers = await User.find({
      _id: { $ne: currentUser._id },
      city: currentUser.city,
      dogs: { $exists: true, $not: { $size: 0 } },
    });

    const dogsForMatching = [];
    otherUsers.forEach((user) => {
      user.dogs.forEach((dog) => {
        dogsForMatching.push({
          dogId: dog._id,
          name: dog.name,
          breed: dog.breed,
          age: dog.age,
          imageUrl: dog.imageUrl,
          owner: {
            userId: user._id,
            name: user.name,
            city: user.city,
            imageUrl: user.imageUrl,
            bio: user.bio,
          },
        });
      });
    });

    res.json(dogsForMatching);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDogsForMatching,
};
