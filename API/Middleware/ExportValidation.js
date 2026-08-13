import jwt from "jsonwebtoken";

export const exportValidation = (req, res, next) => {
  try {
    const { role = null, id = null } = jwt.verify(
      req?.headers?.authorization?.split(" ")[1],
      process.env.JWT_SECRET
    );

    req.userId = id;
    req.role = role;
  } catch (error) {
    req.userId = null;
    req.role = null;
  }
  next();
};
