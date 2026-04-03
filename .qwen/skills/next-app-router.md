# 📘 SKILL: Next.js App Router
## 🎯 Метаданные
- **Фреймворк:** Next.js 14/15 (App Router)
- **Рендеринг:** React Server Components (RSC), Streaming, Server Actions
- **Язык:** TypeScript 5.x
- **Цель:** Генерировать архитектурно корректные, кэшируемые, типизированные и SSR-безопасные маршруты с минимальным использованием Client Components.

## ⚙️ Директивы для агента
1. **Server-First:** По умолчанию все компоненты — серверные. Добавляй `'use client'` только при использовании хуков (`useState`, `useEffect`, `useRouter`), браузерных API или интерактивных библиотек.
2. **Маршрутизация:** Структура `app/` определяет роутинг. Директории без `page.tsx` — route groups `(group)`, с `[]` — динамические параметры, с `[[...slug]]` — catch-all.
3. **Асинхронные API (v15):** `params`, `searchParams`, `headers()`, `cookies()` теперь асинхронные. Всегда используй `await`.
4. **Кэширование:** `fetch` по умолчанию кэширует (`force-cache`). Для динамических данных используй `{ cache: 'no-store' }` или `{ next: { revalidate: N } }`. Явно задавай `export const dynamic = 'force-dynamic'` при необходимости.
5. **Мутации:** Используй Server Actions (`'use server'`) с `formAction` или `action`. Избегай ручных `fetch('/api/...')` внутри компонентов.
6. **Типизация:** Строго типируй `params`, `searchParams`, `generateMetadata`, `generateStaticParams`. Используй `zod` для валидации входных данных Server Actions.

## 📦 Структура и Паттерны
| Файл | Назначение |
|------|------------|
| `layout.tsx` | UI-обертка, провайдеры, навигация, `metadata` (общая) |
| `page.tsx` | Основной контент маршрута |
| `loading.tsx` | React Suspense fallback (автоматически оборачивает страницу) |
| `error.tsx` | Граница ошибки (React Error Boundary, `useEffect` для сброса) |
| `not-found.tsx` | Кастомная 404 (`notFound()` из `next/navigation`) |
| `route.ts` | API Route (только если не подходит Server Action) |

```tsx
// ✅ Правильная структура каталога
app/
├── (auth)/
│ └── login/page.tsx
├── dashboard/
│ ├── [id]/page.tsx
│ ├── loading.tsx
│ └── page.tsx
├── layout.tsx
└── page.tsx
```

## 🌐 Данные и Кэширование
- **Server Data Fetching:** Используй нативный `fetch` в серверных компонентах. Next.js автоматически дедуплицирует запросы.
- **Статическая генерация:** `generateStaticParams()` для SSG динамических маршрутов.
- **Реалистичные паттерны:**
```ts
// ✅ Динамическое ревалидирование
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
const { id } = await params
const data = await fetch(`https://api.example.com/items/${id}`, {
next: { revalidate: 3600 }
}).then(res => res.json())
return <ItemView data={data} />
}

// ✅ Server Action с валидацией
'use server'
export async function updateItem(formData: FormData) {
const schema = z.object({ id: z.string(), title: z.string().min(3) })
const parsed = schema.parse(Object.fromEntries(formData))
await db.item.update({ where: { id: parsed.id }, data: { title: parsed.title } })
revalidatePath(`/dashboard/${parsed.id}`)
}
```

## ⚡ Производительность и Streaming
- **Streaming UI:** Оборачивай тяжелые части в `<Suspense fallback={<LoadingSkeleton />}>`.
- **Изображения:** Всегда используй `<Image />` с явными `width`/`height` или `fill`. Задавай `priority` только для LCP.
- **Динамичность:** Избегай `dynamic = 'force-dynamic'` без причины. Отдавай приоритет `revalidate` или `cache: 'no-store'` для конкретного запроса.
- **Клиентские острова:** Разделяй серверную разметку и интерактивные виджеты. Не делай всю страницу `'use client'`.

## 📝 Чек-лист перед коммитом
- [ ] Нет `'use client'` в файлах без хуков/интерактивности
- [ ] `params`/`searchParams`/`cookies()`/`headers()` промисифицированы и `await`-ятся
- [ ] Все `fetch` имеют явную стратегию кэширования
- [ ] Server Actions используют `zod` + `revalidatePath/tag`
- [ ] `metadata` экспортируется как функция `generateMetadata`
- [ ] Ошибки обрабатываются через `error.tsx` с `useEffect(() => reset(), [error])`
- [ ] Нет утечек `NEXT_PUBLIC_` переменных в серверный код
- [ ] Используются `next/link` и `next/image` вместо нативных аналогов

## 💡 Шаблон генерации (Agent Template)
```tsx
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
const { slug } = await params
return { title: `Product: ${slug}`, description: `Details for ${slug}` }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
const { slug } = await params
const product = await fetch(`https://api.shop/products/${slug}`).then(r => r.ok ? r.json() : null)
if (!product) return notFound()

return (
<main className="container mx-auto px-4 py-8">
<h1 className="text-3xl font-bold">{product.name}</h1>
<Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded" />}>
<ProductReviews productId={product.id} />
</Suspense>
</main>
)
}

// Client Island
'use client'
import { useState } from 'react'
export function ProductReviews({ productId }: { productId: string }) {
const [expanded, setExpanded] = useState(false)
return <button onClick={() => setExpanded(v => !v)}>Toggle Reviews ({expanded ? 'Hide' : 'Show'})</button>}
```