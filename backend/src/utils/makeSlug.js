const slugify = require("slugify");
const makeSlug = (str) =>
  slugify(str, { lower: true, strict: true, trim: true });

module.exports = { makeSlug };
