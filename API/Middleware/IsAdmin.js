const IsAdmin = (req, res, next) => {
  if (req.role !== "admin" && req.role !== "superAdmin") {
    return res.status(403).json({
      success: false,
      message: "شما مجاز به انجام این عملیات نیستید"
    });
  }
  next();
};

export default IsAdmin;