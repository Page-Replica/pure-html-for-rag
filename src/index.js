"use strict";

/**
 * @typedef {Object} CleanHtmlOptions
 * @property {boolean} [collapseWhitespace=true] Collapse consecutive whitespace into single spaces.
 * @property {boolean} [removeEmptyElements=true] Iteratively delete empty tags after cleaning.
 * @property {boolean} [removeComments=true] Strip HTML comments in addition to other elements.
 * @property {string[]} [allowedAttributeTags=["a"]] Tags that should retain their original attributes.
 */

const BLOCK_TAGS = [
	"script",
	"style",
	"picture",
	"svg",
	"iframe",
	"noscript",
	"form",
	"canvas",
	"video",
	"audio",
	"button",
	"select",
	"textarea",
];

const SELF_CLOSING_TAGS = [
	"img",
	"source",
	"track",
	"input",
	"meta",
	"base",
];

const LINK_RELATION_BLOCKLIST = [
	"stylesheet",
	"preload",
	"prefetch",
	"modulepreload",
	"icon",
	"shortcut icon",
	"apple-touch-icon",
	"manifest",
	"dns-prefetch",
	"preconnect",
];

const RELATION_REGEX = new RegExp(
	`<link[^>]+rel=("|')(?:${LINK_RELATION_BLOCKLIST.map((rel) =>
		rel.replace(/[-/\\.^$*+?()|[\]{}]/g, "\\$&"),
	).join("|")})(?:\\s*;[^"']*)?("|')[^>]*>`,
	"gi",
);

const COMMENT_REGEX = /<!--([\s\S]*?)-->/g;

const INLINE_STYLE_REGEX = /\sstyle\s*=\s*("[^"]*"|'[^']*')/gi;

const EVENT_HANDLER_REGEX = /\son[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi;

const CLASS_ATTRIBUTE_REGEX = /\sclass\s*=\s*("[^"]*"|'[^']*')/gi;

const EMPTY_TAG_REGEX = /<([a-z0-9]+)(?:\s[^>]*)?>\s*<\/\1>/gi;

const ATTRIBUTE_PRUNING_REGEX = /<([a-z0-9]+)(\s+[^>]*?)(\/)?>/gi;

function buildBlockRemovalRegex(tag) {
	return new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\/${tag}>`, "gi");
}

function buildSelfClosingRemovalRegex(tag) {
	return new RegExp(`<${tag}[^>]*?>`, "gi");
}

const BLOCK_REMOVERS = BLOCK_TAGS.map((tag) => buildBlockRemovalRegex(tag));
const SELF_CLOSING_REMOVERS = SELF_CLOSING_TAGS.map((tag) =>
	buildSelfClosingRemovalRegex(tag),
);

// Additional non-void elements with lightweight replacements to match legacy behaviour.
const INLINE_REMOVERS = [
	/<link[^>]*>/gi,
];

/**
 * Aggressively clean an HTML string for RAG / LLM ingestion.
 *
 * @param {string} html Input HTML markup.
 * @param {CleanHtmlOptions} [options] Behaviour overrides.
 * @returns {string} Sanitised HTML string.
 */
function cleanHtml(html, options = {}) {
	if (typeof html !== "string") {
		throw new TypeError("Expected `html` to be a string");
	}

	let out = html.trim();
	if (!out) return "";

	const {
		collapseWhitespace = true,
		removeEmptyElements = true,
		removeComments = true,
		allowedAttributeTags = ["a"],
	} = options;

	// Remove entire blocks first
	for (const regex of BLOCK_REMOVERS) {
		out = out.replace(regex, "");
	}

	for (const regex of SELF_CLOSING_REMOVERS) {
		out = out.replace(regex, "");
	}

	for (const regex of INLINE_REMOVERS) {
		out = out.replace(regex, "");
	}

	out = out.replace(RELATION_REGEX, "");
	out = out.replace(INLINE_STYLE_REGEX, "");
	out = out.replace(EVENT_HANDLER_REGEX, "");
	out = out.replace(CLASS_ATTRIBUTE_REGEX, "");

	if (removeComments) {
		out = out.replace(COMMENT_REGEX, "");
	}

	out = stripAttributes(out, allowedAttributeTags);

	if (removeEmptyElements) {
		out = stripEmptyElements(out);
	}

	if (collapseWhitespace) {
		out = collapseWhitespaceSafely(out);
	}

	return out;
}

function stripAttributes(value, allowedAttributeTags) {
	const allowed = new Set(
		Array.isArray(allowedAttributeTags)
			? allowedAttributeTags.map((tag) => String(tag).toLowerCase())
			: [],
	);

	return value.replace(ATTRIBUTE_PRUNING_REGEX, (match, tag, attrs, self) => {
		if (!attrs) return match;
		if (allowed.has(tag.toLowerCase())) return match;
		const closing = self ? " /" : "";
		return `<${tag}${closing}>`;
	});
}

function stripEmptyElements(value) {
	let previous;
	let current = value;
	do {
		previous = current;
		current = current.replace(EMPTY_TAG_REGEX, "");
	} while (current !== previous);
	return current;
}

function collapseWhitespaceSafely(value) {
	return value.replace(/\s+/g, " ").trim();
}

/**
 * Factory helper for reusing default options.
 * @param {CleanHtmlOptions} [defaults]
 * @returns {(html: string, overrides?: CleanHtmlOptions) => string}
 */
function createCleaner(defaults = {}) {
	return (html, overrides = {}) =>
		cleanHtml(html, { ...defaults, ...overrides });
}

module.exports = {
	cleanHtml,
	createCleaner,
};

module.exports.default = cleanHtml;

