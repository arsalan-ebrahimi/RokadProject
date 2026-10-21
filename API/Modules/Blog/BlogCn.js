import mongoose from "mongoose";
import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Blog from "./BlogMd.js";
import { sanitizeHtml, stripHtml } from "../../Utils/htmlSanitizer.js";
import { slugify, generateUniqueSlug } from "../../Utils/slugify.js";

export const create = catchAsync(async (req, res, next) => {
  const { title, slug, description, img, date, tags, tableOfContents, htmlContent } = req.body;

  const cleanTitle = typeof title === "string" ? stripHtml(title) : "";
  const cleanDescription = typeof description === "string" ? stripHtml(description) : "";
  const cleanDate = typeof date === "string" ? stripHtml(date) : "";

  const existingBlog = await Blog.findOne({ title: cleanTitle });
  if (existingBlog) {
    return next(new HandleERROR("مقاله‌ای با این عنوان قبلاً ثبت شده است", 400));
  }

  const finalSlug = await generateUniqueSlug(Blog, slug || cleanTitle);

  const cleanTags = Array.isArray(tags)
    ? tags.map((t) => (typeof t === "string" ? stripHtml(t) : "")).filter(Boolean)
    : [];

  const cleanToc = Array.isArray(tableOfContents)
    ? tableOfContents
        .map((item) => ({
          title: typeof item?.title === "string" ? stripHtml(item.title) : "",
        }))
        .filter((item) => item.title && item.title.length > 0)
    : [];

  const cleanHtml = htmlContent ? sanitizeHtml(htmlContent) : "";

  const newBlog = await Blog.create({
    title: cleanTitle,
    slug: finalSlug,
    description: cleanDescription,
    img,
    date: cleanDate,
    tags: cleanTags,
    tableOfContents: cleanToc,
    htmlContent: cleanHtml,
  });

  return res.status(201).json({
    success: true,
    message: "مقاله با موفقیت ایجاد شد",
    data: newBlog,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Blog, req.query, req.role)
    .filter()
    .search(["title", "slug", "description", "tags"])
    .sort()
    .limitFields()
    .paginate()
    .populate();

  const result = await features.execute();
  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const identifier = req.params.id ? decodeURIComponent(req.params.id).trim() : "";
  const isObjectId = mongoose.Types.ObjectId.isValid(identifier) && /^[0-9a-fA-F]{24}$/.test(identifier);
  const filter = isObjectId
    ? { $or: [{ _id: identifier }, { slug: identifier.toLowerCase() }] }
    : { slug: identifier.toLowerCase() };

  const features = new ApiFeatures(Blog, req.query, req.role)
    .addManualFilters(filter)
    .filter()
    .limitFields()
    .populate();

  const result = await features.execute();

  const doc = Array.isArray(result)
    ? result[0]
    : result?.data
      ? result.data[0]
      : result;

  if (!doc) {
    return next(new HandleERROR("مقاله یافت نشد", 404));
  }

  // Ensure slug exists on legacy documents if missing
  if (!doc.slug && doc._id && doc.title) {
    try {
      const generatedSlug = await generateUniqueSlug(Blog, doc.title, doc._id);
      await Blog.findByIdAndUpdate(doc._id, { slug: generatedSlug });
      doc.slug = generatedSlug;
    } catch (e) {
      // Ignore background slug fix error
    }
  }

  return res.status(200).json({
    success: true,
    data: doc,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const identifier = req.params.id ? decodeURIComponent(req.params.id).trim() : "";
  const isObjectId = mongoose.Types.ObjectId.isValid(identifier) && /^[0-9a-fA-F]{24}$/.test(identifier);
  const filter = isObjectId
    ? { $or: [{ _id: identifier }, { slug: identifier.toLowerCase() }] }
    : { slug: identifier.toLowerCase() };

  const oldBlog = await Blog.findOne(filter);
  if (!oldBlog) {
    return next(new HandleERROR("مقاله یافت نشد", 404));
  }

  const updates = {};

  if (req.body.title !== undefined) {
    updates.title = typeof req.body.title === "string" ? stripHtml(req.body.title) : req.body.title;
  }

  if (req.body.slug !== undefined && req.body.slug.trim() !== "") {
    updates.slug = await generateUniqueSlug(Blog, req.body.slug, oldBlog._id);
  } else if (updates.title && (!oldBlog.slug || req.body.slug === "")) {
    updates.slug = await generateUniqueSlug(Blog, updates.title, oldBlog._id);
  }

  if (req.body.description !== undefined) {
    updates.description = typeof req.body.description === "string" ? stripHtml(req.body.description) : req.body.description;
  }
  if (req.body.date !== undefined) {
    updates.date = typeof req.body.date === "string" ? stripHtml(req.body.date) : req.body.date;
  }
  if (req.body.img !== undefined) {
    updates.img = req.body.img;
  }
  if (req.body.tags !== undefined) {
    updates.tags = Array.isArray(req.body.tags)
      ? req.body.tags.map((t) => (typeof t === "string" ? stripHtml(t) : "")).filter(Boolean)
      : [];
  }
  if (req.body.tableOfContents !== undefined) {
    updates.tableOfContents = Array.isArray(req.body.tableOfContents)
      ? req.body.tableOfContents
          .map((item) => ({
            title: typeof item?.title === "string" ? stripHtml(item.title) : "",
          }))
          .filter((item) => item.title && item.title.length > 0)
      : [];
  }
  if (req.body.htmlContent !== undefined) {
    updates.htmlContent = sanitizeHtml(req.body.htmlContent);
  }

  const updatedBlog = await Blog.findByIdAndUpdate(oldBlog._id, updates, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    message: "مقاله با موفقیت بروزرسانی شد",
    data: updatedBlog,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const identifier = req.params.id ? decodeURIComponent(req.params.id).trim() : "";
  const isObjectId = mongoose.Types.ObjectId.isValid(identifier) && /^[0-9a-fA-F]{24}$/.test(identifier);
  const filter = isObjectId
    ? { $or: [{ _id: identifier }, { slug: identifier.toLowerCase() }] }
    : { slug: identifier.toLowerCase() };

  const deleteBlog = await Blog.findOneAndDelete(filter);

  if (!deleteBlog) {
    return next(new HandleERROR("مقاله یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    message: "مقاله با موفقیت حذف شد",
    data: null,
  });
});