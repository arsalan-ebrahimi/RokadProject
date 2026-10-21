import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Event from "./EventMd.js";
import { stripHtml } from "../../Utils/htmlSanitizer.js";
import { slugify, generateUniqueSlug } from "../../Utils/slugify.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const create = catchAsync(async (req, res, next) => {
  const {
    title,
    slug,
    type,
    date,
    description,
    branch,
    img,
    eventDuration,
    closingLocation,
    holdingDate,
    organizers,
    teams,
    howItWent,
    memorableQuote,
    deadlinesDescription,
    deadlines,
    tags,
  } = req.body;

  const cleanTitle = typeof title === "string" ? stripHtml(title) : "";
  const existingEvent = await Event.findOne({ title: cleanTitle });
  if (existingEvent) {
    return next(new HandleERROR("رویدادی با این عنوان قبلاً ثبت شده است", 400));
  }

  const finalSlug = await generateUniqueSlug(Event, slug || cleanTitle);

  const cleanOrganizers = Array.isArray(organizers)
    ? organizers.map((org) => ({
        name: typeof org?.name === "string" ? stripHtml(org.name) : "",
        role: typeof org?.role === "string" ? stripHtml(org.role) : "",
        category: org?.category,
      }))
    : [];

  const cleanDeadlines = Array.isArray(deadlines)
    ? deadlines.map((dl) => ({
        title: typeof dl?.title === "string" ? stripHtml(dl.title) : "",
        date: typeof dl?.date === "string" ? stripHtml(dl.date) : "",
        description: typeof dl?.description === "string" ? stripHtml(dl.description) : "",
      }))
    : [];

  const cleanTags = Array.isArray(tags)
    ? tags.map((t) => (typeof t === "string" ? stripHtml(t) : "")).filter(Boolean)
    : [];

  const cleanTeams = {
    firstTeam: {
      name: typeof teams?.firstTeam?.name === "string" ? stripHtml(teams.firstTeam.name) : "",
      isHonored: Boolean(teams?.firstTeam?.isHonored),
    },
    secondTeam: {
      name: typeof teams?.secondTeam?.name === "string" ? stripHtml(teams.secondTeam.name) : "",
      isHonored: Boolean(teams?.secondTeam?.isHonored),
    },
    thirdTeam: {
      name: typeof teams?.thirdTeam?.name === "string" ? stripHtml(teams.thirdTeam.name) : "",
      isHonored: Boolean(teams?.thirdTeam?.isHonored),
    },
    honoredTeams: Array.isArray(teams?.honoredTeams)
      ? teams.honoredTeams
          .map((ht) => ({ name: typeof ht?.name === "string" ? stripHtml(ht.name) : "" }))
          .filter((ht) => ht.name)
      : [],
  };

  const newEvent = await Event.create({
    title: cleanTitle,
    slug: finalSlug,
    type: typeof type === "string" ? stripHtml(type) : "",
    date: typeof date === "string" ? stripHtml(date) : "",
    description: typeof description === "string" ? stripHtml(description) : "",
    branch,
    img,
    eventDuration: typeof eventDuration === "string" ? stripHtml(eventDuration) : "",
    closingLocation: typeof closingLocation === "string" ? stripHtml(closingLocation) : "",
    holdingDate: typeof holdingDate === "string" ? stripHtml(holdingDate) : "",
    organizers: cleanOrganizers,
    teams: cleanTeams,
    howItWent: typeof howItWent === "string" ? stripHtml(howItWent) : "",
    memorableQuote: {
      quote: typeof memorableQuote?.quote === "string" ? stripHtml(memorableQuote.quote) : "",
      speaker: typeof memorableQuote?.speaker === "string" ? stripHtml(memorableQuote.speaker) : "",
    },
    deadlinesDescription: typeof deadlinesDescription === "string" ? stripHtml(deadlinesDescription) : "",
    deadlines: cleanDeadlines,
    tags: cleanTags,
  });

  return res.status(201).json({
    success: true,
    message: "رویداد با موفقیت ایجاد شد",
    data: newEvent,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Event, req.query, req.role)
    .filter()
    .search(["title", "slug", "type", "description", "closingLocation", "tags"])
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

  const features = new ApiFeatures(Event, req.query, req.role)
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
    return next(new HandleERROR("رویداد یافت نشد", 404));
  }

  // Ensure slug exists on legacy documents if missing
  if (!doc.slug && doc._id && doc.title) {
    try {
      const generatedSlug = await generateUniqueSlug(Event, doc.title, doc._id);
      await Event.findByIdAndUpdate(doc._id, { slug: generatedSlug });
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

  const oldEvent = await Event.findOne(filter);
  if (!oldEvent) {
    return next(new HandleERROR("رویداد یافت نشد", 404));
  }

  const updates = {};

  if (req.body.title !== undefined) updates.title = typeof req.body.title === "string" ? stripHtml(req.body.title) : req.body.title;

  if (req.body.slug !== undefined && req.body.slug.trim() !== "") {
    updates.slug = await generateUniqueSlug(Event, req.body.slug, oldEvent._id);
  } else if (updates.title && (!oldEvent.slug || req.body.slug === "")) {
    updates.slug = await generateUniqueSlug(Event, updates.title, oldEvent._id);
  }

  if (req.body.type !== undefined) updates.type = typeof req.body.type === "string" ? stripHtml(req.body.type) : req.body.type;
  if (req.body.date !== undefined) updates.date = typeof req.body.date === "string" ? stripHtml(req.body.date) : req.body.date;
  if (req.body.description !== undefined) updates.description = typeof req.body.description === "string" ? stripHtml(req.body.description) : req.body.description;
  if (req.body.branch !== undefined) updates.branch = req.body.branch;
  if (req.body.eventDuration !== undefined) updates.eventDuration = typeof req.body.eventDuration === "string" ? stripHtml(req.body.eventDuration) : req.body.eventDuration;
  if (req.body.closingLocation !== undefined) updates.closingLocation = typeof req.body.closingLocation === "string" ? stripHtml(req.body.closingLocation) : req.body.closingLocation;
  if (req.body.holdingDate !== undefined) updates.holdingDate = typeof req.body.holdingDate === "string" ? stripHtml(req.body.holdingDate) : req.body.holdingDate;
  if (req.body.howItWent !== undefined) updates.howItWent = typeof req.body.howItWent === "string" ? stripHtml(req.body.howItWent) : req.body.howItWent;
  if (req.body.deadlinesDescription !== undefined) updates.deadlinesDescription = typeof req.body.deadlinesDescription === "string" ? stripHtml(req.body.deadlinesDescription) : req.body.deadlinesDescription;

  if (req.body.organizers !== undefined) {
    updates.organizers = Array.isArray(req.body.organizers)
      ? req.body.organizers.map((org) => ({
          name: typeof org?.name === "string" ? stripHtml(org.name) : "",
          role: typeof org?.role === "string" ? stripHtml(org.role) : "",
          category: org?.category,
        }))
      : [];
  }

  if (req.body.teams !== undefined) {
    updates.teams = {
      firstTeam: {
        name: typeof req.body.teams?.firstTeam?.name === "string" ? stripHtml(req.body.teams.firstTeam.name) : "",
        isHonored: Boolean(req.body.teams?.firstTeam?.isHonored),
      },
      secondTeam: {
        name: typeof req.body.teams?.secondTeam?.name === "string" ? stripHtml(req.body.teams.secondTeam.name) : "",
        isHonored: Boolean(req.body.teams?.secondTeam?.isHonored),
      },
      thirdTeam: {
        name: typeof req.body.teams?.thirdTeam?.name === "string" ? stripHtml(req.body.teams.thirdTeam.name) : "",
        isHonored: Boolean(req.body.teams?.thirdTeam?.isHonored),
      },
      honoredTeams: Array.isArray(req.body.teams?.honoredTeams)
        ? req.body.teams.honoredTeams
            .map((ht) => ({ name: typeof ht?.name === "string" ? stripHtml(ht.name) : "" }))
            .filter((ht) => ht.name)
        : [],
    };
  }

  if (req.body.memorableQuote !== undefined) {
    updates.memorableQuote = {
      quote: typeof req.body.memorableQuote?.quote === "string" ? stripHtml(req.body.memorableQuote.quote) : "",
      speaker: typeof req.body.memorableQuote?.speaker === "string" ? stripHtml(req.body.memorableQuote.speaker) : "",
    };
  }

  if (req.body.deadlines !== undefined) {
    updates.deadlines = Array.isArray(req.body.deadlines)
      ? req.body.deadlines.map((dl) => ({
          title: typeof dl?.title === "string" ? stripHtml(dl.title) : "",
          date: typeof dl?.date === "string" ? stripHtml(dl.date) : "",
          description: typeof dl?.description === "string" ? stripHtml(dl.description) : "",
        }))
      : [];
  }

  if (req.body.tags !== undefined) {
    updates.tags = Array.isArray(req.body.tags)
      ? req.body.tags.map((t) => (typeof t === "string" ? stripHtml(t) : "")).filter(Boolean)
      : [];
  }

  if (req.body.img !== undefined && req.body.img !== oldEvent.img) {
    updates.img = req.body.img;
    const oldFilePath = path.join(__dirname, "../../Public", oldEvent.img);
    if (fs.existsSync(oldFilePath)) {
      try {
        fs.unlinkSync(oldFilePath);
      } catch (err) {
        console.error("Failed to remove old event image:", err);
      }
    }
  }

  const updatedEvent = await Event.findByIdAndUpdate(oldEvent._id, updates, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    message: "رویداد با موفقیت بروزرسانی شد",
    data: updatedEvent,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const identifier = req.params.id ? decodeURIComponent(req.params.id).trim() : "";
  const isObjectId = mongoose.Types.ObjectId.isValid(identifier) && /^[0-9a-fA-F]{24}$/.test(identifier);
  const filter = isObjectId
    ? { $or: [{ _id: identifier }, { slug: identifier.toLowerCase() }] }
    : { slug: identifier.toLowerCase() };

  const deleteEvent = await Event.findOneAndDelete(filter);

  if (!deleteEvent) {
    return next(new HandleERROR("رویداد یافت نشد", 404));
  }

  if (deleteEvent.img) {
    const filePath = path.join(__dirname, "../../Public", deleteEvent.img);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete event image:", err);
      }
    }
  }

  return res.status(200).json({
    success: true,
    message: "رویداد با موفقیت حذف شد",
    data: null,
  });
});