const IsLogin = (req, res, next) => {
  if (!req.role  || !req.userId) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to access this resource"
    });
  }
  next();
};
export default IsLogin;