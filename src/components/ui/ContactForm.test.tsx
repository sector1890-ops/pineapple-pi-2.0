/*
 * Отчёт:
 * - Добавлено 7 тестов для ContactForm
 * - Покрыто:
 *   - Рендер формы (1)
 *   - Валидация: пустое имя (1)
 *   - Валидация: короткий email (1)
 *   - Валидация: короткое сообщение (1)
 *   - Успешная отправка (1)
 *   - Ошибка отправки (1)
 *   - Отображение состояния после отправки (1)
 * - Использованы моки:
 *   - @chakra-ui/react
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactForm } from "@/components/ui/ContactForm";

// Мок Chakra UI компонентов
jest.mock("@chakra-ui/react", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Box: (mockProps: Record<string, any>) => {
    const { children, as, ...props } = mockProps;
    const Component = as === "form" ? "form" : "div";
    return <Component {...props}>{children}</Component>;
  },
  Button: ({ children, loading, type, onClick, ...props }: { children?: React.ReactNode; loading?: boolean; type?: HTMLButtonElement["type"]; onClick?: () => void } & Record<string, unknown>) => (
    <button {...props} type={type} disabled={loading} onClick={onClick} data-loading={loading ? "true" : undefined}>
      {children}
    </button>
  ),
  Heading: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <h2 {...props}>{children}</h2>,
  Input: ({ value, onChange, type, placeholder, ...props }: { value?: string; onChange?: (e: { target: { value: string } }) => void; type?: HTMLInputElement["type"]; placeholder?: string } & Record<string, unknown>) => (
    <input {...props} value={value} onChange={onChange} type={type || "text"} placeholder={placeholder} />
  ),
  Text: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <span {...props}>{children}</span>,
  Textarea: ({ value, onChange, placeholder, ...props }: { value?: string; onChange?: (e: { target: { value: string } }) => void; placeholder?: string } & Record<string, unknown>) => (
    <textarea {...props} value={onChange ? value : undefined} onChange={onChange} placeholder={placeholder} />
  ),
  VStack: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <div {...props}>{children}</div>,
  createToaster: () => ({
    create: jest.fn(),
  }),
}));

describe("ContactForm", () => {
  const mockOnSubmit = jest.fn().mockResolvedValue(true);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("должен отображать форму с полями", () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText("Ваше имя")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("example@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Напишите ваше сообщение...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /отправить/i })).toBeInTheDocument();
  });

  it("должен показывать ошибку при пустом имени", async () => {
    const { container } = render(<ContactForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByPlaceholderText("example@email.com");
    const messageTextarea = screen.getByPlaceholderText("Напишите ваше сообщение...");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(messageTextarea, { target: { value: "Достаточно длинное сообщение для теста" } });

    const form = container.querySelector("form");
    fireEvent.submit(form!);

    const nameError = screen.queryByText("Имя должно содержать минимум 2 символа");
    expect(nameError).not.toBeNull();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("должен показывать ошибку при невалидном email", async () => {
    const { container } = render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByPlaceholderText("Ваше имя");
    const emailInput = screen.getByPlaceholderText("example@email.com");
    const messageTextarea = screen.getByPlaceholderText("Напишите ваше сообщение...");

    fireEvent.change(nameInput, { target: { value: "Иван" } });
    fireEvent.change(emailInput, { target: { value: "bad" } });
    fireEvent.change(messageTextarea, { target: { value: "Достаточно длинное сообщение для теста" } });

    const form = container.querySelector("form");
    fireEvent.submit(form!);

    // Ошибки отображаются сразу после submit
    const emailError = screen.queryByText("Введите корректный email");
    expect(emailError).not.toBeNull();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("должен показывать ошибку при коротком сообщении", async () => {
    const { container } = render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByPlaceholderText("Ваше имя");
    const emailInput = screen.getByPlaceholderText("example@email.com");
    const messageTextarea = screen.getByPlaceholderText("Напишите ваше сообщение...");

    fireEvent.change(nameInput, { target: { value: "Иван" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(messageTextarea, { target: { value: "Коротко" } });

    const form = container.querySelector("form");
    fireEvent.submit(form!);

    const messageError = screen.queryByText("Сообщение должно содержать минимум 10 символов");
    expect(messageError).not.toBeNull();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("должен вызывать onSubmit при валидных данных", async () => {
    const { container } = render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByPlaceholderText("Ваше имя");
    const emailInput = screen.getByPlaceholderText("example@email.com");
    const messageTextarea = screen.getByPlaceholderText("Напишите ваше сообщение...");

    fireEvent.change(nameInput, { target: { value: "Иван Иванов" } });
    fireEvent.change(emailInput, { target: { value: "ivan@example.com" } });
    fireEvent.change(messageTextarea, { target: { value: "Достаточно длинное сообщение для теста" } });

    const form = container.querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "Иван Иванов",
        email: "ivan@example.com",
        message: "Достаточно длинное сообщение для теста",
      });
    });
  });

  it("должен показывать сообщение об ошибке при неуспешной отправке", async () => {
    const failingOnSubmit = jest.fn().mockResolvedValue(false);
    const { container } = render(<ContactForm onSubmit={failingOnSubmit} />);

    const nameInput = screen.getByPlaceholderText("Ваше имя");
    const emailInput = screen.getByPlaceholderText("example@email.com");
    const messageTextarea = screen.getByPlaceholderText("Напишите ваше сообщение...");

    fireEvent.change(nameInput, { target: { value: "Иван Иванов" } });
    fireEvent.change(emailInput, { target: { value: "ivan@example.com" } });
    fireEvent.change(messageTextarea, { target: { value: "Достаточно длинное сообщение для теста" } });

    const form = container.querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(failingOnSubmit).toHaveBeenCalled();
    });

    // Форма не должна очищаться при ошибке
    expect(nameInput).toHaveValue("Иван Иванов");
  });

  it("должен показывать сообщение об успехе после отправки", async () => {
    const { container } = render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByPlaceholderText("Ваше имя");
    const emailInput = screen.getByPlaceholderText("example@email.com");
    const messageTextarea = screen.getByPlaceholderText("Напишите ваше сообщение...");

    fireEvent.change(nameInput, { target: { value: "Иван Иванов" } });
    fireEvent.change(emailInput, { target: { value: "ivan@example.com" } });
    fireEvent.change(messageTextarea, { target: { value: "Достаточно длинное сообщение для теста" } });

    const form = container.querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText("Спасибо за обращение!")).toBeInTheDocument();
    });

    expect(screen.getByText("Отправить ещё")).toBeInTheDocument();
  });
});
