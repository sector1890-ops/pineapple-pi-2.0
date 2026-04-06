import Link from "next/link";

/**
 * Кастомная 404 страница (plain HTML — без Chakra UI)
 * Рендерится как Server Component БЕЗ ChakraProvider.
 */
export default function NotFound() {
  return (
    <div style={{ padding: "4rem 1rem", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
      <div style={{ fontSize: "4rem", fontWeight: 700, color: "#319795" }}>404</div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Страница не найдена</h1>
      <p style={{ color: "#6b7280", textAlign: "center", maxWidth: "28rem" }}>
        Запрашиваемая страница не существует или была удалена.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#319795",
          color: "white",
          borderRadius: "0.375rem",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "1rem",
        }}
      >
        Вернуться на главную
      </Link>
    </div>
  );
}
