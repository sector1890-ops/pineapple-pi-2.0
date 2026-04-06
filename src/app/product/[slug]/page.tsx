import { notFound } from "next/navigation";
import { getAllProductSlugs, getProductById } from "@/lib/products";
import { ProductPageClient } from "./ProductPageClient";

/**
 * Генерация статических параметров для всех товаров
 * Next.js вызовет эту функцию на этапе сборки для создания всех /product/[slug] страниц
 */
export function generateStaticParams(): Array<{ slug: string }> {
  return getAllProductSlugs();
}

/**
 * Генерация метаданных страницы товара
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductById(slug);

  if (!product) {
    return {
      title: "Товар не найден",
    };
  }

  return {
    title: `${product.title} | Pineapple Pi`,
    description: product.shortDescription,
  };
}

/**
 * Страница товара (Server Component)
 * SSG: все пути генерируются на этапе сборки через generateStaticParams
 */
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
    
  const product = getProductById(slug);
  
  // Если товар не найден — показать 404
  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}
