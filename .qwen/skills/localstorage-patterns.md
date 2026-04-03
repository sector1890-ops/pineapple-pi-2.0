# 📘 SKILL: LocalStorage Patterns
## 🎯 Метаданные
- **API:** Web Storage (`window.localStorage`)
- **Экосистема:** React 18/19, Next.js 14/15 (App Router), TypeScript 5.x
- **Цель:** Безопасное, типизированное и SSR-совместимое сохранение состояния без блокировки рендера, гидратационных мисматчей и утечек памяти.

## ⚙️ Директивы для агента
1. **SSR-First Guard:** `localStorage` недоступен на сервере. Никогда не обращайся к `window` или `localStorage` в теле компонента или вне `useEffect`/`useLayoutEffect`. При SSR возвращай `initialValue`, синхронизируй на клиенте.
2. **Сериализация:** Все данные проходят через `JSON.stringify`/`JSON.parse`. Оборачивай в `try/catch` — битые данные в хранилище не должны ломать приложение.
3. **Типизация:** Строго типизируй хуки через дженерики `useLocalStorage<T>`. Используй `zod`/`valibot` для валидации при чтении.
4. **Кросстабная синхронизация:** Слушай событие `storage` для обновления состояния в других вкладках. Не дублируй записи в той же вкладке.
5. **Лимиты и ошибки:** `~5MB` на origin. Всегда перехватывай `QuotaExceededError`. Не храни бинарные данные, токены, PII или пароли.
6. **Гидратация:** Чтобы избежать `Hydration Mismatch`, состояние на сервере должно совпадать с начальным состоянием на клиенте. Используй `isHydrated` флаг или `useSyncExternalStore`.

## 📦 Архитектура и Паттерны
| Задача | Паттерн | Примечание |
|--------|---------|------------|
| Базовое состояние | Кастомный хук `useLocalStorage<T>` | Возвращает `[value, setValue, remove]` |
| Валидация данных | `zod` + парсер при чтении | `schema.safeParse(parsed)` с fallback на `initialValue` |
| Кросстаб-синхронизация | `window.addEventListener('storage')` | Срабатывает только в других вкладках/окнах |
| Миграции/Версионирование | `version` поле в объекте | При чтении сверяй версию, применяй `migrate()` |
| Debounce записей | `setTimeout`/`requestIdleCallback` | Избегай тротлинга диска при частых обновлениях |

```tsx
// ✅ Базовый SSR-безопасный хук (Strict Mode safe)
function useLocalStorage<T>(key: string, initialValue: T) {
const [state, setState] = useState<T>(initialValue)
const [isHydrated, setIsHydrated] = useState(false)

useEffect(() => {
try {
const raw = window.localStorage.getItem(key)
if (raw !== null) setState(JSON.parse(raw))
} catch { /* corrupted data, keep initial */ }
setIsHydrated(true)
}, [key])

useEffect(() => {
if (!isHydrated) return
try {
window.localStorage.setItem(key, JSON.stringify(state))
} catch (e) {
if (e instanceof DOMException && e.name === 'QuotaExceededError') {
console.warn(`LocalStorage quota exceeded for key: ${key}`)
}
}
}, [key, state, isHydrated])

// Cross-tab sync
useEffect(() => {
const handler = (e: StorageEvent) => {
if (e.key === key && e.newValue !== null) {
try { setState(JSON.parse(e.newValue)) } catch {}
}
}
window.addEventListener('storage', handler)
return () => window.removeEventListener('storage', handler)
}, [key])

return [state, setState, () => { setState(initialValue); window.localStorage.removeItem(key) }] as const
}
```

## ⚡ Производительность и Безопасность
- **Избегай блокировки:** Большие объекты сериализуй асинхронно или разбивай на чанки. `localStorage` синхронен и блокирует main thread при тяжелых операциях.
- **Debounced Writes:** При частых обновлениях (ввод текста, скролл) используй `useDebounce` или `requestAnimationFrame` перед записью.
- **Безопасность данных:** `localStorage` доступен любому JS-скрипту на домене (включая XSS). Никогда не сохраняй `accessToken`, `refreshToken`, cookies или персональные данные. Для сессий используй `httpOnly` cookies.
- **Очистка:** Предусматривай механизм очистки (`clear()`, `remove()`) и миграции при изменении схемы данных.
- **Feature Detection:** В старых/ограниченных окружениях `localStorage` может быть отключен. Проверяй `try { localStorage.setItem('test', '1'); localStorage.removeItem('test'); } catch { /* fallback to memory */ }`.

## 📝 Чек-лист перед коммитом
- [ ] Нет прямого доступа к `window.localStorage` вне `useEffect` или guards
- [ ] SSR-гидратация не вызывает мисматчей (`isHydrated` или `useSyncExternalStore`)
- [ ] `JSON.parse`/`JSON.stringify` обернуты в `try/catch`
- [ ] Типизация строгая, fallback на `initialValue` при ошибках парсинга
- [ ] Обработка `QuotaExceededError` и отключенного хранилища
- [ ] Кросстаб-синхронизация реализована (если требуется)
- [ ] Нет чувствительных данных (токены, PII, пароли)
- [ ] Частые обновления debounce-ятся или batch-атся
- [ ] Предусмотрена функция очистки/миграции версии данных

## 💡 Шаблон генерации (Agent Template)
```ts
// hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from 'react'
import { z } from 'zod'

type StorageHookReturn<T> = [
value: T,
setValue: (val: T | ((prev: T) => T)) => void,
remove: () => void
]

export function useLocalStorage<T>(
key: string,
initialValue: T,
options?: { schema?: z.ZodType<T>; debounceMs?: number }
): StorageHookReturn<T> {
const [state, setState] = useState<T>(initialValue)
const [isHydrated, setIsHydrated] = useState(false)
const { schema, debounceMs = 300 } = options ?? {}

// 1. Read & Hydrate
useEffect(() => {
try {
const raw = window.localStorage.getItem(key)
if (raw !== null) {
const parsed = JSON.parse(raw)
const validated = schema ? schema.parse(parsed) : parsed
setState(validated)
}
} catch {
// Corrupted or invalid data → fallback to initialValue
}
setIsHydrated(true)
}, [key, schema])

// 2. Write (Debounced)
useEffect(() => {
if (!isHydrated) return
const timeout = setTimeout(() => {
try {
window.localStorage.setItem(key, JSON.stringify(state))
} catch (e) {
if (e instanceof DOMException && e.name === 'QuotaExceededError') {
console.warn(`[LocalStorage] Quota exceeded: ${key}`)
}
}
}, debounceMs)
return () => clearTimeout(timeout)
}, [key, state, isHydrated, debounceMs])

// 3. Cross-tab sync
useEffect(() => {
const handler = (e: StorageEvent) => {
if (e.key === key && e.newValue !== null) {
try {
const parsed = JSON.parse(e.newValue)
const validated = schema ? schema.parse(parsed) : parsed
setState(validated)
} catch {}
}
}
window.addEventListener('storage', handler)
return () => window.removeEventListener('storage', handler)
}, [key, schema])

const remove = useCallback(() => {
setState(initialValue)
window.localStorage.removeItem(key)
}, [key, initialValue])

return [state, setState, remove] as const
}
```

```tsx
// usage.tsx
'use client'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { z } from 'zod'

const ThemeSchema = z.object({
mode: z.enum(['light', 'dark', 'system']).default('system'),
fontSize: z.number().min(12).max(24).default(16)
})

export function SettingsPanel() {
const [theme, setTheme, resetTheme] = useLocalStorage('app_theme', ThemeSchema.parse({}), {
schema: ThemeSchema,
debounceMs: 500
})

return (
<div className="p-4 space-y-4 border rounded">
<select
value={theme.mode}
onChange={e => setTheme(prev => ({ ...prev, mode: e.target.value as 'light'|'dark'|'system' }))}
className="border p-2 rounded"
>
<option value="light">Light</option>
<option value="dark">Dark</option>
<option value="system">System</option>
</select>
<input
type="range" min="12" max="24"
value={theme.fontSize}
onChange={e => setTheme(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
/>
<button onClick={resetTheme} className="text-red-500 underline">
Reset to defaults
</button>
</div>
)
}
```