import crypto from "crypto";

// ==========================================
// Utility: slugify
// Converts Persian/English titles to URL-safe SEO-friendly slugs
// ==========================================

export const slugify = (text) => {
  if (!text || typeof text !== "string") return "";
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[۰-۹]/g, (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)])
    .replace(/[٠-٩]/g, (d) => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)])
    .replace(/[\u200c\u200d\u200e\u200f]/g, "-")
    .replace(/[\s\t\n\r_+/\\.:,;!?()"'[\]{}|<>*&^%$#@~`]+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 150);
};

/**
 * Generates a unique slug for a Mongoose model.
 * If baseSlug already exists on a different document, appends a counter or random hex suffix.
 * @param {import("mongoose").Model} model
 * @param {string} baseText
 * @param {string|null} currentDocId
 * @returns {Promise<string>}
 */
export const generateUniqueSlug = async (model, baseText, currentDocId = null) => {
  let baseSlug = slugify(baseText);
  if (!baseSlug) {
    baseSlug = `item-${Date.now().toString(36)}`;
  }

  let candidateSlug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug: candidateSlug };
    if (currentDocId) {
      query._id = { $ne: currentDocId };
    }

    const existing = await model.findOne(query).lean();
    if (!existing) {
      return candidateSlug;
    }

    counter += 1;
    if (counter <= 5) {
      candidateSlug = `${baseSlug}-${counter}`;
    } else {
      const suffix = crypto.randomBytes(3).toString("hex");
      candidateSlug = `${baseSlug}-${suffix}`;
      break;
    }
  }

  return candidateSlug;
};

export default slugify;