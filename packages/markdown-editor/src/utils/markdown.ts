import MarkdownIt from 'markdown-it';
import type { MarkdownItOptions } from '../types';

/**
 * Create a configured markdown-it instance
 */
export function createMarkdownParser(options: MarkdownItOptions = {}): MarkdownIt {
  const md = new MarkdownIt({
    html: options.html ?? true,
    xhtmlOut: options.xhtmlOut ?? false,
    breaks: options.breaks ?? true,
    linkify: options.linkify ?? true,
    typographer: options.typographer ?? true,
  });

  return md;
}

/**
 * Parse markdown to HTML
 */
export function parseMarkdown(
  content: string,
  options: MarkdownItOptions = {}
): string {
  const md = createMarkdownParser(options);
  return md.render(content);
}

/**
 * Extract frontmatter from markdown (YAML between --- delimiters)
 */
export function extractFrontmatter(content: string): {
  frontmatter: Record<string, string> | null;
  body: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: null, body: content };
  }

  try {
    const frontmatter: Record<string, string> = {};
    const lines = match[1].split('\n');

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim();
        frontmatter[key] = value.replace(/^["']|["']$/g, '');
      }
    }

    return {
      frontmatter,
      body: content.slice(match[0].length),
    };
  } catch {
    return { frontmatter: null, body: content };
  }
}

/**
 * Generate table of contents from markdown headings
 */
export function generateTOC(content: string): Array<{ level: number; text: string; id: string }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: Array<{ level: number; text: string; id: string }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    toc.push({ level, text, id });
  }

  return toc;
}

/**
 * Wrap selected text with markdown syntax
 */
export function wrapText(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  prefix: string,
  suffix?: string
): { text: string; newSelectionStart: number; newSelectionEnd: number } {
  const before = text.slice(0, selectionStart);
  const selected = text.slice(selectionStart, selectionEnd);
  const after = text.slice(selectionEnd);
  const actualSuffix = suffix ?? prefix;

  const newText = before + prefix + selected + actualSuffix + after;

  return {
    text: newText,
    newSelectionStart: selectionStart + prefix.length,
    newSelectionEnd: selectionEnd + prefix.length,
  };
}

/**
 * Insert text at position
 */
export function insertText(
  text: string,
  position: number,
  insertion: string
): { text: string; newPosition: number } {
  const newText = text.slice(0, position) + insertion + text.slice(position);
  return {
    text: newText,
    newPosition: position + insertion.length,
  };
}
