/*
 * Отчёт:
 * - Добавлено 8 тестов для валидации заказа
 * - Покрыто:
 *   - Успешная валидация (1)
 *   - Пустая корзина (1)
 *   - Отсутствие items (1)
 *   - Невалидный item без title (1)
 *   - Quantity < 1 (1)
 *   - Отрицательная цена (1)
 *   - Отсутствие delivery (1)
 *   - Множественные ошибки (1)
 */

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

function validateOrder(data: OrderRequest): string[] {
  const errors: string[] = [];

  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.push("items: обязательное поле, корзина не должна быть пустой");
  } else {
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

  if (typeof data.delivery !== "boolean") {
    errors.push("delivery: обязательное булево поле");
  }

  if (typeof data.subtotal !== "number" || data.subtotal < 0) {
    errors.push("subtotal: обязательное числовое поле");
  }

  if (typeof data.deliveryCost !== "number" || data.deliveryCost < 0) {
    errors.push("deliveryCost: обязательное числовое поле");
  }

  if (typeof data.total !== "number" || data.total < 0) {
    errors.push("total: обязательное числовое поле");
  }

  return errors;
}

describe("Валидация заказа", () => {
  const validOrder = {
    items: [
      {
        id: "product-1",
        title: "Test Product",
        price: 50,
        quantity: 2,
      },
    ],
    delivery: true,
    subtotal: 100,
    deliveryCost: 5,
    total: 105,
  };

  it("должен возвращать пустой массив при валидном заказе", () => {
    const errors = validateOrder(validOrder);

    expect(errors).toHaveLength(0);
  });

  it("должен возвращать ошибку при пустой корзине", () => {
    const errors = validateOrder({
      items: [],
      delivery: false,
      subtotal: 0,
      deliveryCost: 0,
      total: 0,
    });

    expect(errors).toContainEqual(expect.stringContaining("items"));
    expect(errors).toHaveLength(1);
  });

  it("должен возвращать ошибку при отсутствии items", () => {
    const errors = validateOrder({
      delivery: true,
      subtotal: 100,
      deliveryCost: 5,
      total: 105,
    });

    expect(errors).toContainEqual(expect.stringContaining("items"));
  });

  it("должен возвращать ошибку при невалидном item без title", () => {
    const errors = validateOrder({
      items: [
        {
          id: "product-1",
          price: 50,
          quantity: 1,
        },
      ],
      delivery: true,
      subtotal: 50,
      deliveryCost: 5,
      total: 55,
    });

    expect(errors).toContainEqual(expect.stringContaining("title"));
  });

  it("должен возвращать ошибку при quantity < 1", () => {
    const errors = validateOrder({
      items: [
        {
          id: "product-1",
          title: "Test Product",
          price: 50,
          quantity: 0,
        },
      ],
      delivery: true,
      subtotal: 100,
      deliveryCost: 5,
      total: 105,
    });

    expect(errors).toContainEqual(expect.stringContaining("quantity"));
  });

  it("должен возвращать ошибку при отрицательной цене", () => {
    const errors = validateOrder({
      items: [
        {
          id: "product-1",
          title: "Test Product",
          price: -10,
          quantity: 1,
        },
      ],
      delivery: true,
      subtotal: 100,
      deliveryCost: 5,
      total: 105,
    });

    expect(errors).toContainEqual(expect.stringContaining("price"));
  });

  it("должен возвращать ошибку при отсутствии delivery", () => {
    const errors = validateOrder({
      items: validOrder.items,
      subtotal: 100,
      deliveryCost: 5,
      total: 105,
    });

    expect(errors).toContainEqual(expect.stringContaining("delivery"));
  });

  it("должен возвращать несколько ошибок при множественных проблемах", () => {
    const errors = validateOrder({
      items: [],
      subtotal: -10,
      deliveryCost: 5,
      total: 105,
    });

    expect(errors.length).toBeGreaterThanOrEqual(2);
  });
});
