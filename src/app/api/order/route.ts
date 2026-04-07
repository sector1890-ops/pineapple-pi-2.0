import { NextRequest, NextResponse } from "next/server";

interface OrderItem {
  id?: unknown;
  title?: unknown;
  price?: unknown;
  quantity?: unknown;
}

interface OrderRequest {
  items?: unknown;
  delivery?: unknown;
  subtotal?: unknown;
  deliveryCost?: unknown;
  total?: unknown;
}

/**
 * Валидация данных заказа
 */
function validateOrder(data: OrderRequest): string[] {
  const errors: string[] = [];

  // items: массив, не пустой
  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.push("items: обязательное поле, корзина не должна быть пустой");
  } else {
    // Валидация каждого элемента
    data.items.forEach((item: OrderItem, index: number) => {
      if (typeof item.id !== "string") {
        errors.push(`items[${index}].id: обязательное поле`);
      }
      if (typeof item.title !== "string") {
        errors.push(`items[${index}].title: обязательное поле`);
      }
      if (typeof item.price !== "number" || item.price < 0) {
        errors.push(`items[${index}].price: обязательное числовое поле`);
      }
      if (typeof item.quantity !== "number" || item.quantity < 1) {
        errors.push(`items[${index}].quantity: обязательное поле, минимум 1`);
      }
    });
  }

  // delivery: boolean
  if (typeof data.delivery !== "boolean") {
    errors.push("delivery: обязательное булево поле");
  }

  // subtotal: число
  if (typeof data.subtotal !== "number" || data.subtotal < 0) {
    errors.push("subtotal: обязательное числовое поле");
  }

  // deliveryCost: число
  if (typeof data.deliveryCost !== "number" || data.deliveryCost < 0) {
    errors.push("deliveryCost: обязательное числовое поле");
  }

  // total: число
  if (typeof data.total !== "number" || data.total < 0) {
    errors.push("total: обязательное числовое поле");
  }

  return errors;
}

/**
 * POST /api/order
 * Моковый API для оформления заказа
 */
export async function POST(request: NextRequest) {
  try {
    const body: OrderRequest = await request.json();
    const errors = validateOrder(body);

    // Ошибки валидации
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Ошибка валидации",
          errors,
        },
        { status: 400 }
      );
    }

    // Имитация задержки (1-2 секунды)
    const delay = Math.floor(Math.random() * 1000) + 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Генерация фейкового orderId
    const orderId = `ORD-${Date.now()}`;

    return NextResponse.json({
      success: true,
      orderId,
      message: "Заказ успешно оформлен",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}
