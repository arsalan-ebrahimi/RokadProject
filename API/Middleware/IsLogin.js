export const IsLogin = (req, res, next) => {
  if (!req.role || !req.userId) {
    return res.status(401).json({
      success: false,
      message: "لطفا ابتدا وارد حساب کاربری خود شوید"
    });
  }
  next();
};