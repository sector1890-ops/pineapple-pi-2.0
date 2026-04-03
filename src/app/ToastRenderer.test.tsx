/*
 * Отчёт:
 * - Добавлено 3 тестов
 * - Покрыто:
 *   - Happy path (2): рендер после mount, отображение Toaster
 *   - Поведение (1): Toaster получает toaster prop
 * - Использованы моки:
 *   - ./HomePageClient (toaster)
 *   - @chakra-ui/react (Toaster, Toast)
 */

import { render, screen, waitFor } from "@testing-library/react";
import { ToastRenderer } from "./ToastRenderer";

// Мок для toaster из HomePageClient
jest.mock("./HomePageClient", () => ({
  toaster: {
    create: jest.fn(),
  },
}));

// Мок для Chakra UI компонентов - сохраняем ссылку для проверок
const mockToasterRender = jest.fn(({ children }) => (
  <div data-testid="toaster">{children}</div>
));

jest.mock("@chakra-ui/react", () => ({
  get Toaster() {
    return mockToasterRender;
  },
  Toast: {
    Root: jest.fn(({ children }) => <div data-testid="toast">{children}</div>),
    Title: jest.fn(({ children }) => <div data-testid="toast-title">{children}</div>),
    CloseTrigger: jest.fn(() => <button data-testid="toast-close">Close</button>),
  },
}));

describe("ToastRenderer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Рендер", () => {
    it("должен рендерить компонент без ошибок", () => {
      expect(() => render(<ToastRenderer />)).not.toThrow();
    });

    it("должен отображать Toaster после mount", async () => {
      render(<ToastRenderer />);

      // Ждём завершения всех асинхронных обновлений
      await waitFor(() => {
        expect(screen.getByTestId("toaster")).toBeInTheDocument();
      });
    });

    it("должен вызывать Toaster с правильными props", async () => {
      render(<ToastRenderer />);

      await waitFor(() => {
        expect(mockToasterRender).toHaveBeenCalled();
        const callArgs = mockToasterRender.mock.calls[0][0];
        expect(callArgs).toHaveProperty("toaster");
        expect(callArgs.toaster).toHaveProperty("create");
      });
    });
  });
});
