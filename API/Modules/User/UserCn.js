import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import User from "./UserMd.js";
import bcryptjs from "bcryptjs";




export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(User, req.query, req.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const result = await features.execute();
  return res.status(200).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(User, req.query, req.role)
    .addManualFilters(
      req.role == "user" ? { _id: req.userId } : { _id: req.params.id },
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      {
        path: "favoriteProducts",
        select: "title images",
      },
      {
        path: "boughtProducts",
        select: "title images",
      },
      { path: "cartId" },
    ]);
  const result = await features.execute();
  return res.status(200).json(result);
});
export const update = catchAsync(async (req, res, next) => {
  if (req.role == "user" && req.userId != req.params.id) {
    return next(
      new HandleERROR("You are not authorized to update this user", 403),
    );
  }
  const { fullName = null, password = null, role = null } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new HandleERROR("User not found", 404));
  }
  user.fullName = fullName || user.fullName;
  user.birthDate = birthDate || user.birthDate;
  user.password = password ? bcryptjs.hashSync(password, 10) : user.password;
  if (req.role == "superAdmin" && role) {
    user.role = role;
  }
  const newUser = await user.save();
  return res.status(200).json({
    message: "User updated successfully",
    data: newUser,
    success: true,
  });
});
