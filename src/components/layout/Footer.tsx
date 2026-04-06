import Link from "next/link";
import { Monitor, Mail, Phone, MapPin } from "lucide-react";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "О компании" },
  { href: "/contact", label: "Контакты" },
  { href: "/favorites", label: "Избранное" },
  { href: "/cart", label: "Корзина" },
];

const contacts = [
  { icon: Mail, label: "Email", value: "info@pineapplepi.dev" },
  { icon: Phone, label: "Телефон", value: "+7 (800) 123-45-67" },
  { icon: MapPin, label: "Адрес", value: "г. Москва, ул. Примерная, д. 42" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--chakra-colors-gray-50, #f7f7f7)",
        borderTop: "1px solid var(--chakra-colors-gray-200, #e2e8f0)",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "2.5rem 1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* Навигация */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Monitor size={20} color="var(--chakra-colors-teal-500, #319795)" />
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#319795" }}>
                Pineapple Pi
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: "#6b7280",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#319795")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Контакты */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "flex-start" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, margin: 0 }}>Контакты</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {contacts.map((contact) => (
                <div key={contact.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <contact.icon size={16} color="#319795" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>{contact.label}</span>
                    <span style={{ fontSize: "0.875rem" }}>{contact.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* О проекте */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "flex-start" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, margin: 0 }}>О проекте</h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
              Pineapple Pi — каталог микрокомпьютеров для встраиваемых систем,
              IoT и прототипирования. Компактные решения для разработчиков и
              инженеров.
            </p>
          </div>
        </div>

        <div style={{ marginTop: "2rem", marginBottom: "1rem", borderTop: "1px solid #e2e8f0" }} />

        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
          &copy; {currentYear} Pineapple Pi. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
