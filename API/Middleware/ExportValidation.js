import jwt from "jsonwebtoken";

export const exportValidation = (req, res, next) => {
  try {
    const authHeader = req?.headers?.authorization;
    if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token && process.env.JWT_SECRET) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
          algorithms: ["HS256"],
        });
        req.userId = decoded.id || null;
        req.role = decoded.role || null;
        return next();
      }
    }
    req.userId = null;
    req.role = null;
  } catch (error) {
    req.userId = null;
    req.role = null;
  }
  next();
};
