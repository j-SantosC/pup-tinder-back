const errorHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res
      .status(401)
      .json({ valid: false, error: "Token inválido o faltante" });
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};

module.exports = errorHandler;
