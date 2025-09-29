import slugify from "slugify";
export const makeSlug = (str) =>
  slugify(str, { lower: true, strict: true, trim: true });
