/**
 * Типы данных для каталога товаров Pineapple Pi 2.0
 */

/**
 * Товар в каталоге
 */
export interface Product {
  /** Уникальный идентификатор (slug из имени файла) */
  id: string;
  /** Название товара (из H1 в Markdown) */
  title: string;
  /** Массив характеристик */
  specifications: string[];
  /** Числовая цена (например, 40) */
  price: number;
  /** Форматированная цена (например, "$40") */
  priceFormatted: string;
  /** Путь к изображению (например, "/products/images/PineapplePi-M4Berry.jpg") */
  imagePath: string;
  /** Краткое описание (первые 3 пункта спецификации) */
  shortDescription: string;
  /** URL-friendly идентификатор */
  slug: string;
}

/**
 * Элемент корзины
 */
export interface CartItem {
  /** Объект товара */
  product: Product;
  /** Количество единиц */
  quantity: number;
}

/**
 * Данные для оформления заказа
 */
export interface OrderData {
  /** Список товаров */
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  /** Флаг доставки */
  delivery: boolean;
  /** Сумма товаров */
  subtotal: number;
  /** Стоимость доставки */
  deliveryCost: number;
  /** Итоговая сумма */
  total: number;
}
