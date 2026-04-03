# 📘 SKILL: TypeScript 5.x
## 🎯 Метаданные
- **Версия:** TypeScript 5.x (совместимо с 4.9+)
- **Экосистема:** React 18/19, Node.js 20+, Vite/Next.js, Bun
- **Цель:** Генерировать строго типизированный, безопасный к `null/undefined`, производительный и легко рефакторимый код без `any` и скрытых багов рантайма.

## ⚙️ Директивы для агента
1. **Strict Mode:** `strict: true` — абсолютный стандарт. Запрещены `any`, неявные `any`, нестрогие проверки `null/undefined`.
2. **`unknown` вместо `any`:** Все внешние данные, API-ответы, `JSON.parse` и `catch`-блоки начинаются с `unknown`. Сужай тип через type guards или библиотеки валидации (zod/valibot).
3. **`type` vs `interface`:** Используй `type` для объединений (`|`), пересечений (`&`), mapped types и вычисляемых структур. `interface` — только для расширяемых публичных API контрактов или деклараций библиотек.
4. **`satisfies` > `as`:** Применяй `satisfies` для валидации литералов без потери точности типов. Оператор `as` допустим только для DOM/браузерных API, тестовых моков и legacy-кода.
5. **Явные сигнатуры:** Все экспортируемые функции/хуки должны иметь явный `return` тип. Асинхронные функции всегда возвращают `Promise<T>`.
6. **Индексы:** Предполагай `noUncheckedIndexedAccess`. Любой доступ по ключу `obj[key]` или `arr[i]` может быть `undefined`. Всегда проверяй или используй nullish coalescing.

## ⚙️ Базовая конфигурация (`tsconfig.json`)
```json
{
"compilerOptions": {
"target": "ES2022",
"module": "ESNext",
"moduleResolution": "bundler",
"strict": true,
"noUncheckedIndexedAccess": true,
"exactOptionalPropertyTypes": true,
"skipLibCheck": true,
"esModuleInterop": true,
"forceConsistentCasingInFileNames": true,
"isolatedModules": true,
"verbatimModuleSyntax": true
},
"include": ["src/**/*.ts", "src/**/*.tsx"],
"exclude": ["node_modules"]
}
```

## 🧱 Архитектура и Паттерны типизации
| Задача | Паттерн | Пример |
|--------|---------|--------|
| Статусы/Состояния | Discriminated Unions | `type Status = { type: 'loading' } \| { type: 'success'; data: T }` |
| Константы/Конфиги | `satisfies` + `as const` | `const config = { ... } satisfies Config` |
| Безопасные ID | Branded Types | `type UserId = string & { readonly __brand: 'UserId' }` |
| Частичные обновления | Utility Types | `type UpdatePayload = Pick<User, 'name' | 'email'>` |
| Валидация рантайма | Type Guards | `function isUser(v: unknown): v is User { ... }` |

```ts
// ✅ Discriminated Union + Exhaustive Check
type Result<T> =
| { status: 'pending' }
| { status: 'success'; data: T }
| { status: 'error'; message: string }

function renderResult<T>(res: Result<T>): string {
switch (res.status) {
case 'success': return `OK: ${res.data}`
case 'error': return `Fail: ${res.message}`
case 'pending': return 'Loading...'
default:
const _exhaustiveCheck: never = res
throw new Error(`Unhandled status: ${_exhaustiveCheck}`)
}
}
```

## ⚡ Производительность и Безопасность типов
- **`const` assertions:** Всегда применяй `as const` к объектам/массивам конфигурации, чтобы сохранить литеральные типы.
- **`readonly` по умолчанию:** Массивы и свойства объектов помечай как `readonly`, если не планируется мутация. Используй `ReadonlyArray<T>` вместо `T[]`.
- **Оптимизация IDE:** Избегай глубоко рекурсивных conditional types в публичных API. Кэшируй сложные вычисляемые типы в отдельные `type`.
- **`exactOptionalPropertyTypes`:** Запрещает присваивание `undefined` опциональным полям. Используй `delete obj.key` вместо `obj.key = undefined`.
- **Игнорирование ошибок:** `// @ts-expect-error` допустим только с комментарием *почему*. `// @ts-ignore` запрещен.
- **Генерики:** Всегда ограничивай дженерики `extends`. Избегай `T = any`. Пример: `function process<T extends Record<string, unknown>>(input: T)`.

## 📝 Чек-лист перед коммитом
- [ ] `strict: true` включен, нет необоснованных флагов в `tsconfig`
- [ ] Ни одного `any` в коде (заменено на `unknown` + guard/валидация)
- [ ] Все экспортируемые функции имеют явный `return type`
- [ ] `noUncheckedIndexedAccess` учтен: доступ к массивам/объектам проверен на `undefined`
- [ ] `satisfies` используется вместо `as` для валидации структур
- [ ] `as const` применен к конфигурационным объектам/массивам
- [ ] Нет `// @ts-ignore`, только осознанные `// @ts-expect-error`
- [ ] Discriminated unions исчерпывающе обработаны (`never` check)
- [ ] Branded types используются для первичных ключей/URL/идентификаторов

## 💡 Шаблон генерации (Agent Template)
```ts
// types.ts
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type ApiResponse<T> =
| { ok: true; data: T; status: number }
| { ok: false; error: string; status: number }

export type BrandedId<TBrand extends string> = string & { readonly __brand: TBrand }
export type UserId = BrandedId<'UserId'>
export type PostId = BrandedId<'PostId'>

// utils/guards.ts
export function isApiResponse<T>(val: unknown): val is ApiResponse<T> {
return (
typeof val === 'object' &&
val !== null &&
'ok' in val &&
typeof (val as ApiResponse<T>).ok === 'boolean'
)
}

// services/api.ts
export async function fetchResource<T>(
url: string,
method: HttpMethod = 'GET',
body?: unknown
): Promise<ApiResponse<T>> {
try {
const res = await fetch(url, {
method,
headers: { 'Content-Type': 'application/json' },
body: body ? JSON.stringify(body) : undefined,
})

const json = await res.json()
if (!res.ok) return { ok: false, error: json.message ?? 'Unknown error', status: res.status }
return { ok: true, json, status: res.status }
} catch (err) {
const message = err instanceof Error ? err.message : 'Network failure'
return { ok: false, error: message, status: 500 }
}
}

// usage.ts
const config = {
retries: 3,
timeout: 5000,
endpoints: { users: '/api/users', posts: '/api/posts' }
} as const satisfies { readonly retries: number; readonly timeout: number; readonly endpoints: Record<string, string> }

async function loadUser(id: UserId) {
const res = await fetchResource<{ id: UserId; name: string }>(config.endpoints.users)
if (res.ok) {
// res.data.id имеет тип UserId, полная безопасность типов
return res.data.name
}
throw new Error(res.error)
}
```