export async function formatAIResponse(text: string) {
  if (!text) return "";

  let formatted = text;

  // 1. Clean up weird Markdown divider lines like =======
  formatted = formatted.replace(/={3,}/g, "");

  // 2. Fix bold headers smashed into content (e.g., "\n**Themes:**\n")
  // Only targets bold text that ends with a colon or spans an entire line/paragraph
  formatted = formatted.replace(/(?:^|\n)(?:\s*)(\*\*[^*:\n]+:?\*\*|\*\*[^*:\n]+\*\*:\s*)(?:\s*)(?=\n|$)/g, "\n\n$1\n\n");

  // 3. Fix Markdown headers smashed into text (e.g., "### Header * Bullet")
  formatted = formatted.replace(/(#{1,6}\s+[^\n]+)/g, "\n\n$1\n\n");

  // 4. Fix smashed bullet points (e.g., "* Point 1 * Point 2" or "- Point 1 - Point 2")
  // Forces every bullet point character to start on its own newline
  formatted = formatted.replace(/(?<=\s)(\*|-)\s+/g, "\n$1 ");

  // 5. Clean up accidental triple or quadruple spacing caused by the fixes above
  formatted = formatted.replace(/\n{3,}/g, "\n\n");

  console.log(formatted);
  return formatted.trim();
}
