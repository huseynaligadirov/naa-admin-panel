// Application constants

export const API_BASE_URL = "http://51.20.12.26:3000";

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

