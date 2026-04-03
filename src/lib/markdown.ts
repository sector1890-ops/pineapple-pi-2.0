import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked, Token } from "marked";
import type { Product } from "@/types/product";

/**
 * Распарсить Markdown файл товара
 * @param filePath - Полный путь к .md файлу
 * @returns Объект Product или null при ошибке
 */
export function parseMarkdownFile(filePath: string): Product | null {
  try {
    // Читаем файл
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Извлекаем имя файла без расширения как ID
    const fileName = path.basename(filePath, ".md");
    const id = fileName;
    const slug = fileName;

    // Парсим через gray-matter (на случай frontmatter)
    const { content, data } = matter(fileContent);

    // Если есть frontmatter с title, используем его
    let title = data.title as string | undefined;

    // Парсим markdown через marked для извлечения заголовков
    const tokens = marked.lexer(content);

    // Ищем H1 заголовок, если title не был в frontmatter
    if (!title) {
      const h1Token = tokens.find((token) => token.type === "heading" && "depth" in token && token.depth === 1 && "text" in token);
      if (h1Token && "text" in h1Token) {
        title = h1Token.text;
      }
    }

    if (!title) {
      console.error(`[parseMarkdownFile] Не найден H1 заголовок в файле: ${filePath}`);
      return null;
    }

    // Извлекаем секцию Specification
    const specifications = extractSpecifications(tokens);

    if (specifications.length === 0) {
      console.error(`[parseMarkdownFile] Не найдена секция Specification в файле: ${filePath}`);
      return null;
    }

    // Извлекаем цену
    const priceInfo = extractPrice(content);

    if (!priceInfo) {
      console.error(`[parseMarkdownFile] Не найдена цена в файле: ${filePath}`);
      return null;
    }

    // Формируем путь к изображению
    const imagePath = `/products/images/${id}.jpg`;

    // Краткое описание - первые 3 пункта спецификации
    const shortDescription = specifications.slice(0, 3).join(", ");

    return {
      id,
      title,
      specifications,
      price: priceInfo.value,
      priceFormatted: priceInfo.formatted,
      imagePath,
      shortDescription,
      slug,
    };
  } catch (error) {
    console.error(`[parseMarkdownFile] Ошибка чтения файла ${filePath}:`, error);
    return null;
  }
}

/**
 * Извлечь спецификации из токенов marked
 * Ищем секцию после заголовка "Specification" и извлекаем элементы списка
 */
function extractSpecifications(tokens: Token[]): string[] {
  const specifications: string[] = [];
  let inSpecificationSection = false;

  for (const token of tokens) {
    // Ищем заголовок Specification
    if (token.type === "heading" && "depth" in token && "text" in token) {
      const headingText = token.text.toLowerCase();
      if (headingText === "specification" || headingText === "спецификация") {
        inSpecificationSection = true;
        continue;
      } else if (inSpecificationSection) {
        // Если встретили другой заголовок после спецификации - выходим
        break;
      }
    }

    // Если в секции спецификации, собираем элементы списка
    if (inSpecificationSection && token.type === "list") {
      const listToken = token as import("marked").Tokens.List & { items: Array<{ text: string }> };
      for (const item of listToken.items) {
        const text = item.text.trim();
        if (text) {
          specifications.push(text);
        }
      }
      // После списка спецификаций выходим
      break;
    }
  }

  return specifications;
}

/**
 * Извлечь цену из Markdown контента
 * Ищем паттерн $XX или цену в секции Price
 */
function extractPrice(content: string): { value: number; formatted: string } | null {
  // Сначала пытаемся найти секцию Price и извлечь цену оттуда
  const priceSectionMatch = content.match(/##\s+Price\s*\n+\s*\$?(\d+)/i);
  if (priceSectionMatch) {
    const value = parseInt(priceSectionMatch[1], 10);
    if (!isNaN(value)) {
      return {
        value,
        formatted: `$${value}`,
      };
    }
  }

  // Если не нашли в секции, ищем просто паттерн $XX во всём контенте
  const priceMatch = content.match(/\$(\d+)/);
  if (priceMatch) {
    const value = parseInt(priceMatch[1], 10);
    if (!isNaN(value)) {
      return {
        value,
        formatted: `$${value}`,
      };
    }
  }

  return null;
}
