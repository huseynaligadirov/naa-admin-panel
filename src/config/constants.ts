// Application constants

export const API_BASE_URL = "https://api.svdev.me";

export const API_ENDPOINTS = {
  POSTS: "/posts",
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
} as const;

export const POST_CATEGORIES = {
  NEWS: "news",
  ANNOUNCEMENT: "announcement",
} as const;

export const LANGUAGES = {
  AZERBAIJANI: "az",
  ENGLISH: "en",
} as const;

export const POST_TYPES = {
  NEWS: "News",
  ANNOUNCEMENT: "Announcement",
} as const;

export const DEFAULT_FORM_VALUES = {
  category: POST_CATEGORIES.NEWS,
  language: LANGUAGES.AZERBAIJANI,
  htmlContent: "",
  plainContent: "",
} as const;

