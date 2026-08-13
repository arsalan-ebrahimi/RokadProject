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
      req.role === "user" ? { _id: req.userId } : { _id: req.params.id }
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
  if (req.role === "user" && req.userId !== req.params.id) {
    return next(new HandleERROR("شما مجاز به ویرایش اطلاعات این کاربر نیستید", 403));
  }

  const { fullName, password, role, birthDate } = req.body;
  
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new HandleERROR("کاربر یافت نشد", 404));
  }

  if (fullName !== undefined) user.fullName = fullName;
  if (birthDate !== undefined) user.birthDate = birthDate;
  if (password) user.password = await bcryptjs.hash(password, 12);
  if (req.role === "superAdmin" && role) user.role = role;

  const updatedUser = await user.save();
  
  return res.status(200).json({
    success: true,
    message: "اطلاعات کاربر با موفقیت بروزرسانی شد",
    data: updatedUser,
  });
});