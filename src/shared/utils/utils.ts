export function decode(html: string): string {
  return html
    .replace(/&#60;/g, '<')
    .replace(/&#62;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'");
}
