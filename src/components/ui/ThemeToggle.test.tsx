/*
 * Отчёт:
 * - Добавлено 4 теста для ThemeToggle
 * - Покрыто:
 *   - Рендер иконки луны в светлой теме по умолчанию (1)
 *   - Рендер иконки солнца в тёмной теме (1)
 *   - Переключение темы (1)
 *   - Сохранение в localStorage и добавление класса dark (1)
 * - Использованы моки:
 *   - @chakra-ui/react
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Мок Chakra UI
jest.mock("@chakra-ui/react", () => ({
  IconButton: ({ children, "aria-label": ariaLabel, onClick }: { children: React.ReactNode; "aria-label"?: string; onClick?: () => void }) => (
    <button aria-label={ariaLabel} onClick={onClick}>
      {children}
    </button>
  ),
}));

// Мок lucide-react
jest.mock("lucide-react", () => ({
  Sun: () => <span data-testid="sun-icon">Sun</span>,
  Moon: () => <span data-testid="moon-icon">Moon</span>,
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark", "light");
    // Мок matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it("должен отображать иконку луны в светлой теме по умолчанию", () => {
    render(<ThemeToggle />);

    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("должен отображать иконку солнца в тёмной теме", () => {
    localStorage.setItem("chakra-ui-color-mode", "dark");
    render(<ThemeToggle />);

    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
  });

  it("должен переключать тему при клике", () => {
    render(<ThemeToggle />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
    expect(localStorage.getItem("chakra-ui-color-mode")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("должен сохранять выбор в localStorage", () => {
    render(<ThemeToggle />);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);

    expect(localStorage.getItem("chakra-ui-color-mode")).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
  });
});
