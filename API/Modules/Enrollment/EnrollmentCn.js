import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Enrollment from "./EnrollmentMd.js";

export const create = catchAsync(async (req, res, next) => {
  const existing = await Enrollment.findOne({
    nationalCode: req.body.nationalCode,
  });
  if (existing) {
    return next(
      new HandleERROR(
        "Student with this National Code is already enrolled",
        400,
      ),
    );
  }

  const newEnrollment = await Enrollment.create(req.body);

  return res.status(201).json({
    success: true,
    message: "Enrollment submitted successfully",
    data: newEnrollment,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  if (!["admin", "superAdmin"].includes(req.role)) {
    return next(new HandleERROR("Access denied. Admins only.", 403));
  }

  const features = new ApiFeatures(Enrollment, req.query, req.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();

  const result = await features.execute();
  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const filter = { _id: req.params.id };

  if (!["admin", "superAdmin"].includes(req.role)) {
    return next(new HandleERROR("Access denied.", 403));
  }

  const features = new ApiFeatures(Enrollment, req.query)
    .addManualFilters(filter)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();

  const result = await features.execute();

  if (!result || (Array.isArray(result) && result.length === 0)) {
    return next(
      new HandleERROR("Enrollment record not found or access denied", 404),
    );
  }

  return res.status(200).json(result);
});

export const update = catchAsync(async (req, res, next) => {
  if (!["admin", "superAdmin"].includes(req.role)) {
    return next(
      new HandleERROR("You are not authorized to update records", 403),
    );
  }

  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return next(new HandleERROR("Enrollment record not found", 404));
  }

  enrollment.firstName = req.body.firstName ?? enrollment.firstName;
  enrollment.lastName = req.body.lastName ?? enrollment.lastName;
  enrollment.fatherName = req.body.fatherName ?? enrollment.fatherName;
  enrollment.motherName = req.body.motherName ?? enrollment.motherName;
  enrollment.birthDate = req.body.birthDate ?? enrollment.birthDate;
  enrollment.mobileNumber = req.body.mobileNumber ?? enrollment.mobileNumber;
  enrollment.parentsMobileNumber = req.body.parentsMobileNumber ?? enrollment.parentsMobileNumber;
  enrollment.landlineNumber = req.body.landlineNumber ?? enrollment.landlineNumber;
  enrollment.grade = req.body.grade ?? enrollment.grade;
  enrollment.schoolType = req.body.schoolType ?? enrollment.schoolType;
  enrollment.major = req.body.major ?? enrollment.major;

  const updatedEnrollment = await enrollment.save();

  return res.status(200).json({
    success: true,
    message: "Record updated successfully",
    data: updatedEnrollment,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  if (!["admin", "superAdmin"].includes(req.role)) {
    return next(new HandleERROR("Only admins can delete records", 403));
  }

  const deleteEnrollment = await Enrollment.findByIdAndDelete(req.params.id);

  if (!deleteEnrollment) {
    return next(new HandleERROR("Record not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Enrollment deleted successfully",
  });
});