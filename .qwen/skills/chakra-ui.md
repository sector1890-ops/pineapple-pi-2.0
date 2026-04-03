# Chakra UI Skill для QWEN-CLI

# 📘 SKILL: Chakra UI для QWEN-CLI
## 🎯 Метаданные
- **Библиотека:** `@chakra-ui/react` (актуально v3.x, обратная совместимость с v2)
- **Архитектура:** React 18/19, TypeScript, CSS-in-JS (Emotion)
- **Цель:** Предоставить агенту четкие правила, паттерны и ограничения для генерации чистого, доступного и производительного UI.

## ⚙️ Директивы для агента
1. **Версионность:** Всегда проверяй `package.json`. v3 использует `createSystem`/`defaultSystem`, v2 использует `extendTheme`.
2. **Стилизация:** Приоритет: системные токены > responsive-объекты > `sx` > инлайн-стили. Запрещены `!important` и прямые манипуляции `style`.
3. **Композиция:** Предпочитай `Stack`/`Flex`/`Grid` вложенным `div`.
4. **Доступность:** Никогда не переопределяй `role`, `tabIndex`, `aria-*` без явной необходимости. Chakra обеспечивает базовую a11y из коробки.
5. **Типизация:** Все компоненты строго типизированы. Используй `React.ComponentProps<typeof Component>` для пропсов.

## 📦 Установка и базовая настройка
```bash
# v3 (рекомендуется)
npm i @chakra-ui/react@3 @emotion/react @emotion/styled framer-motion
# v2 (legacy)
npm i @chakra-ui/react@2 @emotion/react @emotion/styled framer-motion
```

### Провайдер (Root Layout)
```tsx
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"

export function Providers({ children }: { children: React.ReactNode }) {
// v3: value={system} | v2: theme={customTheme}
return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
}
```

## 🧱 Layout и Компоненты
| Задача | Рекомендуемый компонент | Примечание |
|--------|------------------------|------------|
| Базовый контейнер | `Box` | Универсальный `div` со стайлинг-пропсами |
| Потоковый лейаут | `Stack` / `HStack` / `VStack` | Автоматический `gap` и выравнивание |
| Сетка | `Grid` / `SimpleGrid` | `columns={{ base: 1, md: 2 }}` |
| Ограничение ширины | `Container` | `maxW="container.xl"`, центрирование |
| Карточки | `Card` (v3) / `Box` (v2) | `Card.Header`, `Card.Body`, `Card.Footer` |

```tsx
// ✅ Паттерн композиции
<Flex gap={6} align="stretch" wrap="wrap">
{items.map(item => <ProductCard key={item.id} data={item} />)}
</Flex>
```

## 🎨 Стилизация и Токены
- **Responsive-объекты:** `{ base: "sm", md: "md", lg: "lg" }` (mobile-first)
- **Основные токены:** `space`, `colors`, `radii`, `fontSizes`, `fontWeights`, `shadows`
- **Кастомизация (v3):**
```ts
import { createSystem, defaultConfig } from "@chakra-ui/react"
export const system = createSystem(defaultConfig, {
theme: {
tokens: {
colors: { brand: { value: "#4F46E5" } },
space: { section: { value: "4rem" } }
}
}
})
```
- **Использование:** `<Box bg="brand" p="section" borderRadius="lg" />`

## 📱 Адаптивность
- Используй объекты/массивы в пропсах: `w={{ base: "100%", md: "50%", lg: "33%" }}`
- Хук `useBreakpointValue()` применяй только когда нужна JS-логика (рендер-ветвление).
- Избегай `useMediaQuery`, если достаточно CSS-вариантов.
- Тестируй на `prefers-reduced-motion` для анимаций.

## ♿ Доступность (a11y)
- Chakra UI следует WAI-ARIA. Не добавляй `aria-hidden="true"` на интерактивные элементы.
- Для сложных виджетов (combobox, tabs, modal) используй `@ark-ui/react` примитивы.
- Фокус-менеджмент: `initialFocusRef`, `autoFocus`, `trapFocus` работают из коробки в модальных окнах.
- Проверяй контраст: `color="fg.muted"` для вторичного текста, `fg.default` для основного.

## ⚡ Производительность
- `React.memo` для компонентов с тяжелым рендером или частыми обновлениями пропсов.
- Избегай инлайн-функций в JSX: `onClick={handleClick}` вместо `onClick={() => handleClick(id)}`.
- Для списков >50 элементов используй `@tanstack/react-virtual`.
- Отключай `framer-motion` если `useReducedMotion()` возвращает `true`.
- Tree-shaking: импортируй только нужные компоненты `import { Box, Button } from "@chakra-ui/react"`.

## 🔄 Миграция v2 → v3 (Ключевые отличия)
| v2 | v3 |
|----|----|
| `ChakraProvider theme={theme}` | `ChakraProvider value={system}` |
| `extendTheme({})` | `createSystem(defaultConfig, { theme: {} })` |
| `css={}` prop | Удален. Используй `sx={}` или системные пропсы |
| `Image`, `InputLeftAddon` | Перемещены в `@chakra-ui/primitives` |
| `useColorMode()` | `useColorMode()` (сохранен, но prefers-color-scheme приоритетнее) |

## 📝 Чек-лист перед коммитом
- [ ] Компоненты обернуты в `ChakraProvider` на уровне приложения
- [ ] Нет хардкод значений (`#333`, `16px`, `20px`) → заменены на токены
- [ ] Адаптивность реализована через `{ base, md, lg }`, а не медиа-запросы
- [ ] `aria-*` и семантика не нарушены, фокус-трапы работают
- [ ] Типизация строгая, `any`/`unknown` отсутствуют
- [ ] Нет лишних оберток, композиция оптимизирована
- [ ] Анимации уважают `prefers-reduced-motion`

## 💡 Шаблон генерации (Agent Template)
```tsx
import { Box, Flex, Text, Button, Stack, Badge } from "@chakra-ui/react"

interface MetricCardProps {
label: string
value: string | number
delta?: number
status?: "success" | "warning" | "error"
}

export const MetricCard: React.FC<MetricCardProps> = ({
label, value, delta, status = "success"
}) => (
<Box p={5} borderRadius="lg" bg="bg.panel" shadow="sm" borderWidth="1px">
<Stack gap={3}>
<Text fontSize="sm" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
{label}
</Text>
<Flex align="baseline" gap={2} wrap="wrap">
<Text fontSize="3xl" fontWeight="bold">{value}</Text>
{delta !== undefined && (
<Badge variant={status === "success" ? "solid" : "subtle"} colorScheme={status}>
{delta > 0 ? `+${delta}%` : `${delta}%`}
</Badge>
)}
</Flex>
<Button size="sm" variant="ghost" w="fit-content">
Подробнее →
</Button>
</Stack>
</Box>
)
```