export function htmlToPlainText(htmlContent: string) {
  // 1. Remove all HTML tags
  let text = htmlContent.replace(/<[^>]*>/g, ' ');

  // 2. Decode basic HTML entities
  text = text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

  // 3. Collapse multiple spaces into one
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}