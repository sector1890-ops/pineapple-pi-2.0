import fs from "fs";
import path from "path";
import { parseMarkdownFile } from "./markdown";
import type { Product } from "@/types/product";

/**
 * Директория с Markdown файлами товаров
 * Используем process.cwd() для получения корня проекта
 */
const PRODUCTS_DIR = path.join(process.cwd(), "public", "products", "specification");

/**
 * Кэш товаров для предотвращения повторного чтения файлов
 */
let productsCache: Product[] | null = null;

/**
 * Получить все товары из Markdown файлов
 * @returns Массив объектов Product
 */
export function getAllProducts(): Product[] {
  // Возвращаем кэш если есть
  if (productsCache) {
    return productsCache;
  }

  try {
    // Проверяем существование директории
    if (!fs.existsSync(PRODUCTS_DIR)) {
      console.warn(`[getAllProducts] Директория товаров не найдена: ${PRODUCTS_DIR}`);
      return [];
    }

    // Читаем все .md файлы из директории
    const files = fs.readdirSync(PRODUCTS_DIR).filter((file) => file.endsWith(".md"));

    // Парсим каждый файл
    const products: Product[] = [];

    for (const file of files) {
      const filePath = path.join(PRODUCTS_DIR, file);
      const product = parseMarkdownFile(filePath);

      if (product) {
        products.push(product);
      } else {
        console.warn(`[getAllProducts] Пропущен файл: ${file}`);
      }
    }

    // Кэшируем результат
    productsCache = products;

    return products;
  } catch (error) {
    console.error("[getAllProducts] Ошибка чтения товаров:", error);
    return [];
  }
}

/**
 * Получить товар по ID (slug)
 * @param id - Slug товара
 * @returns Объект Product или null
 */
export function getProductById(id: string): Product | null {
  const products = getAllProducts();
  return products.find((product) => product.id === id || product.slug === id) ?? null;
}

/**
 * Получить все slug товаров для генерации статических путей
 * @returns Массив объектов с param id
 */
export function getAllProductSlugs(): Array<{ id: string }> {
  const products = getAllProducts();
  return products.map((product) => ({ id: product.id }));
}

/**
 * Очистить кэш товаров (для тестирования)
 */
export function clearProductsCache(): void {
  productsCache = null;
}
