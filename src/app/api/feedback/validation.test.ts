/*
 * Отчёт:
 * - Добавлено 5 тестов для валидации формы обратной связи
 * - Покрыто:
 *   - Успешная валидация (1)
 *   - Пустое имя (1)
 *   - Короткое имя (1)
 *   - Невалидный email (1)
 *   - Короткое сообщение (1)
 */

/**
 * Регулярное выражение для валидации email
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FeedbackRequest {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}

function validateFeedback(data: FeedbackRequest): string[] {
  const errors: string[] = [];

  if (typeof data.name !== "string" || data.name.trim().length < 2) {
    errors.push("name: обязательное поле, минимум 2 символа");
  }

  if (typeof data.email !== "string" || !EMAIL_REGEX.test(data.email.trim())) {
    errors.push("email: обязательное поле, неверный формат");
  }

  if (typeof data.message !== "string" || data.message.trim().length < 10) {
    errors.push("message: обязательное поле, минимум 10 символов");
  }

  return errors;
}

describe("Валидация формы обратной связи", () => {
  it("должен возвращать пустой массив при валидных данных", () => {
    const errors = validateFeedback({
      name: "Иван Иванов",
      email: "ivan@example.com",
      message: "Это тестовое сообщение для проверки API",
    });

    expect(errors).toHaveLength(0);
  });

  it("должен возвращать ошибку при пустом имени", () => {
    const errors = validateFeedback({
      name: "",
      email: "ivan@example.com",
      message: "Это тестовое сообщение для проверки API",
    });

    expect(errors).toContainEqual(expect.stringContaining("name"));
    expect(errors).toHaveLength(1);
  });

  it("должен возвращать ошибку при коротком имени (< 2 символов)", () => {
    const errors = validateFeedback({
      name: "А",
      email: "ivan@example.com",
      message: "Это тестовое сообщение для проверки API",
    });

    expect(errors).toContainEqual(expect.stringContaining("name"));
    expect(errors).toHaveLength(1);
  });

  it("должен возвращать ошибку при невалидном email", () => {
    const errors = validateFeedback({
      name: "Иван Иванов",
      email: "неправильный-email",
      message: "Это тестовое сообщение для проверки API",
    });

    expect(errors).toContainEqual(expect.stringContaining("email"));
    expect(errors).toHaveLength(1);
  });

  it("должен возвращать ошибку при коротком сообщении (< 10 символов)", () => {
    const errors = validateFeedback({
      name: "Иван Иванов",
      email: "ivan@example.com",
      message: "Короткое",
    });

    expect(errors).toContainEqual(expect.stringContaining("message"));
    expect(errors).toHaveLength(1);
  });
});
