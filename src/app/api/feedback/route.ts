import { NextRequest, NextResponse } from "next/server";

/**
 * Регулярное выражение для валидации email
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FeedbackRequest {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}

/**
 * Валидация данных формы обратной связи
 */
function validateFeedback(data: FeedbackRequest): string[] {
  const errors: string[] = [];

  // name: не пустой, min 2 символа
  if (typeof data.name !== "string" || data.name.trim().length < 2) {
    errors.push("name: обязательное поле, минимум 2 символа");
  }

  // email: не пустой, формат email
  if (typeof data.email !== "string" || !EMAIL_REGEX.test(data.email.trim())) {
    errors.push("email: обязательное поле, неверный формат");
  }

  // message: не пустой, min 10 символов
  if (typeof data.message !== "string" || data.message.trim().length < 10) {
    errors.push("message: обязательное поле, минимум 10 символов");
  }

  return errors;
}

/**
 * POST /api/feedback
 * Моковый API для обработки формы обратной связи
 */
export async function POST(request: NextRequest) {
  try {
    const body: FeedbackRequest = await request.json();
    const errors = validateFeedback(body);

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

    return NextResponse.json({
      success: true,
      message: "Сообщение успешно отправлено",
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
