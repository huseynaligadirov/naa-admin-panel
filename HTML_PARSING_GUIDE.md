# HTML Content Parsing Guide

This guide explains how to parse and process HTML content from the `react-simple-wysiwyg` editor.

## Overview

The `react-simple-wysiwyg` editor outputs HTML as a string. The HTML is stored in the form field `htmlContent` and sent to the API. Here's how to parse and use it:

## Current Flow

1. **Editor Output**: The editor outputs HTML string (e.g., `"<p>Hello <strong>World</strong>!</p>"`)
2. **Form Storage**: Stored in `formData.htmlContent` 
3. **API Submission**: Sent as-is to the backend API
4. **Display**: Can be displayed directly using `dangerouslySetInnerHTML` or parsed for specific needs

## Utility Functions

I've created utility functions in `src/utils/htmlParser.ts` to help you parse HTML content:

### 1. Extract Plain Text

```typescript
import { extractPlainText } from "../utils/htmlParser";

const html = "<p>Hello <strong>World</strong>!</p>";
const plainText = extractPlainText(html);
// Result: "Hello World!"
```

**Use Cases:**
- Displaying plain text previews
- Search functionality
- Meta descriptions
- Plain text exports

### 2. Truncate HTML Content

```typescript
import { truncateHtml } from "../utils/htmlParser";

const html = "<p>This is a long paragraph with <strong>bold</strong> text.</p>";
const truncated = truncateHtml(html, 20);
// Result: "<p>This is a long parag...</p>"
```

**Use Cases:**
- Post previews in lists
- Truncated descriptions
- Card views

### 3. Sanitize HTML (Security)

```typescript
import { sanitizeHtml } from "../utils/htmlParser";

const html = "<p>Hello <script>alert('xss')</script>World</p>";
const safe = sanitizeHtml(html);
// Result: "<p>Hello World</p>" (script removed)
```

**Use Cases:**
- Displaying user-generated content
- Preventing XSS attacks
- Safe HTML rendering

### 4. Extract Links

```typescript
import { extractLinks } from "../utils/htmlParser";

const html = '<p>Visit <a href="https://example.com">Example</a> site</p>';
const links = extractLinks(html);
// Result: [{ href: "https://example.com", text: "Example" }]
```

**Use Cases:**
- Link validation
- Link previews
- External link tracking

### 5. Extract Images

```typescript
import { extractImages } from "../utils/htmlParser";

const html = '<p><img src="image1.jpg" alt="Image 1"></p>';
const images = extractImages(html);
// Result: ["image1.jpg"]
```

**Use Cases:**
- Image gallery generation
- Image optimization
- Thumbnail extraction

### 6. Count Words

```typescript
import { countWords } from "../utils/htmlParser";

const html = "<p>Hello world! This is a test.</p>";
const count = countWords(html);
// Result: 5
```

**Use Cases:**
- Reading time calculation
- Content length validation
- Statistics

### 7. Check if Empty

```typescript
import { isHtmlEmpty } from "../utils/htmlParser";

const html = "<p><br></p>";
const isEmpty = isHtmlEmpty(html);
// Result: true
```

**Use Cases:**
- Form validation
- Content checks
- Default content handling

### 8. Get Plain Text Preview

```typescript
import { getPlainTextPreview } from "../utils/htmlParser";

const html = "<p>This is a <strong>long</strong> paragraph...</p>";
const preview = getPlainTextPreview(html, 50);
// Result: "This is a long paragraph..."
```

**Use Cases:**
- Meta descriptions
- Search results
- Social media previews

## Practical Examples

### Example 1: Displaying HTML Content

```typescript
// In a component
function PostContent({ htmlContent }: { htmlContent: string }) {
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      className="post-content"
    />
  );
}
```

### Example 2: Displaying Plain Text Preview

```typescript
import { extractPlainText } from "../utils/htmlParser";

function PostPreview({ htmlContent }: { htmlContent: string }) {
  const plainText = extractPlainText(htmlContent);
  return <p>{plainText}</p>;
}
```

### Example 3: Truncated Preview in Table

```typescript
import { getPlainTextPreview } from "../utils/htmlParser";

// In MainContent.tsx
{data.posts.map((post: Post) => (
  <tr key={post.id}>
    <td>
      <div className="post-desc">
        {getPlainTextPreview(post.htmlContent, 60)}
      </div>
    </td>
  </tr>
))}
```

### Example 4: Form Validation

```typescript
import { isHtmlEmpty } from "../utils/htmlParser";

const validateHtmlContent = (html: string) => {
  if (isHtmlEmpty(html)) {
    return "Content cannot be empty";
  }
  return true;
};
```

### Example 5: Reading Time Calculation

```typescript
import { countWords } from "../utils/htmlParser";

function calculateReadingTime(htmlContent: string): string {
  const words = countWords(htmlContent);
  const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words/min
  return `${readingTime} min read`;
}
```

## How the Editor Works

1. **User Types**: User types in the editor
2. **Editor Output**: Editor outputs HTML string via `onChange` event
3. **Form Update**: `field.onChange(e.target.value)` updates the form
4. **Form Storage**: HTML string stored in `formData.htmlContent`
5. **API Submission**: HTML string sent to API as-is

## Current Implementation

In `CreatePostModal.tsx`:
```typescript
<Controller
  name="htmlContent"
  control={control}
  render={({ field }) => (
    <RichTextEditor field={field} error={errors.htmlContent?.message} />
  )}
/>
```

In `RichTextEditor.tsx`:
```typescript
const handleChange = (e: ContentEditableEvent) => {
  field.onChange(e.target.value); // e.target.value is the HTML string
};
```

In `api.ts`:
```typescript
data.append("htmlContent", formData.htmlContent); // HTML string sent to API
```

## Best Practices

1. **Always Sanitize**: When displaying user-generated HTML, use `sanitizeHtml()` to prevent XSS attacks
2. **Use Plain Text for Previews**: Use `extractPlainText()` or `getPlainTextPreview()` for list views
3. **Validate Content**: Use `isHtmlEmpty()` to validate required fields
4. **Extract Metadata**: Use `extractLinks()` and `extractImages()` for metadata extraction

## Common Patterns

### Pattern 1: Display with Sanitization
```typescript
import { sanitizeHtml } from "../utils/htmlParser";

const safeHtml = sanitizeHtml(htmlContent);
<div dangerouslySetInnerHTML={{ __html: safeHtml }} />
```

### Pattern 2: Preview with Truncation
```typescript
import { getPlainTextPreview } from "../utils/htmlParser";

const preview = getPlainTextPreview(htmlContent, 100);
<p>{preview}</p>
```

### Pattern 3: Full Content Display
```typescript
<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
```

## Summary

- **Editor Output**: HTML string (e.g., `"<p>Hello <strong>World</strong>!</p>"`)
- **Storage**: Stored as string in form data
- **API**: Sent as-is to backend
- **Display**: Use `dangerouslySetInnerHTML` or parse with utilities
- **Security**: Always sanitize before displaying user-generated content
- **Previews**: Use plain text extraction for previews

