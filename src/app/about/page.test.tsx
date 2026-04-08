/*
 * Отчёт:
 * - Добавлено 4 теста для страницы О компании
 * - Покрыто:
 *   - Рендер заголовка (1)
 *   - Рендер секции миссии (1)
 *   - Рендер ценностей (1)
 *   - Рендер статистики (1)
 */

import { render, screen } from "@testing-library/react";
import AboutPage from "./page";
import type { ComponentProps, PropsWithChildren } from "react";

// Мок Chakra UI компонентов
jest.mock("@chakra-ui/react", () => ({
  Box: ({ children, display, ...props }: PropsWithChildren<ComponentProps<"div">> & { display?: string }) => (
    <div {...props} style={display === "flex" ? { display: "flex" } : undefined}>{children}</div>
  ),
  Container: ({ children }: PropsWithChildren<Record<string, unknown>>) => <div>{children}</div>,
  Heading: ({ children }: PropsWithChildren<Record<string, unknown>>) => <h2>{children}</h2>,
  Text: ({ children }: PropsWithChildren<Record<string, unknown>>) => <p>{children}</p>,
  VStack: ({ children }: PropsWithChildren<Record<string, unknown>>) => <div>{children}</div>,
  SimpleGrid: ({ children }: PropsWithChildren<Record<string, unknown>>) => <div>{children}</div>,
}));

jest.mock("@/data/about-company", () => ({
  aboutCompany: {
    title: "О компании Pineapple Pi",
    subtitle: "Инновации в каждом микрокомпьютере",
    introduction: {
      text: "Текст введения",
      highlight: "5 лет на рынке",
    },
    mission: {
      title: "Наша миссия",
      text: "Текст миссии",
    },
    values: [
      { title: "Инновации", description: "Описание инноваций" },
      { title: "Качество", description: "Описание качества" },
    ],
    history: {
      title: "Наша история",
      content: [
        { year: "2020", event: "Основание компании" },
        { year: "2021", event: "Запуск первого продукта" },
      ],
    },
    statistics: {
      title: "Цифры и факты",
      items: [
        { value: "500K+", label: "Проданных устройств" },
        { value: "50+", label: "Стран" },
      ],
    },
    team: {
      title: "Наша команда",
      description: "Описание команды",
      roles: ["Инженеры", "Разработчики"],
    },
    manufacturing: {
      title: "Производство",
      content: "Текст о производстве",
    },
    sustainability: {
      title: "Устойчивое развитие",
      content: "Текст об устойчивом развитии",
    },
    contact: {
      title: "Свяжитесь с нами",
      email: "info@pineapplepi.com",
      support: "support@pineapplepi.com",
      press: "press@pineapplepi.com",
    },
  },
}));

describe("AboutPage", () => {
  it("должен отображать заголовок страницы", () => {
    render(<AboutPage />);

    expect(screen.getByText("О компании Pineapple Pi")).toBeInTheDocument();
    expect(screen.getByText("Инновации в каждом микрокомпьютере")).toBeInTheDocument();
  });

  it("должен отображать секцию миссии", () => {
    render(<AboutPage />);

    expect(screen.getByText("Наша миссия")).toBeInTheDocument();
    expect(screen.getByText("Текст миссии")).toBeInTheDocument();
  });

  it("должен отображать ценности компании", () => {
    render(<AboutPage />);

    expect(screen.getByText("Инновации")).toBeInTheDocument();
    expect(screen.getByText("Описание инноваций")).toBeInTheDocument();
    expect(screen.getByText("Качество")).toBeInTheDocument();
  });

  it("должен отображать статистику", () => {
    render(<AboutPage />);

    expect(screen.getByText("500K+")).toBeInTheDocument();
    expect(screen.getByText("Проданных устройств")).toBeInTheDocument();
    expect(screen.getByText("50+")).toBeInTheDocument();
    expect(screen.getByText("Стран")).toBeInTheDocument();
  });
});
