# 📘 SKILL: Jest Testing
## 🎯 Метаданные
- **Фреймворк:** Jest 29.x / 30.x
- **Экосистема:** TypeScript 5.x, React 18/19, `@testing-library/react`, `@testing-library/jest-dom`
- **Цель:** Создание детерминированных, изолированных, быстрых и полностью типизированных тестов с правильным управлением асинхронностью, мокированием и покрытием бизнес-логики.

## ⚙️ Директивы для агента
1. **Изоляция состояния:** Каждый тест должен быть полностью независим. Используй `beforeEach`/`afterEach` для сброса моков и очищения DOM. Никогда не полагайся на порядок выполнения.
2. **Мокирование:** `jest.mock()` автоматически поднимается (hoisted). Всегда передавай строковый путь к модулю. Для частичных моков используй `jest.spyOn()`. Избегай `mockImplementationOnce` без `mockReset()` между тестами.
3. **Асинхронность:** Запрещен коллбэк `done`. Всегда используй `async/await` или возврат `Promise`. Для React-асинхронности применяй `waitFor`, `findBy*` из RTL.
4. **Типизация:** Импортируй глобалы явно: `import { jest, expect, describe, it, beforeEach } from '@jest/globals'`. Типизируй моки через `jest.MockedFunction<typeof fn>` или `jest.Mocked`.
5. **Assertions:** Предпочитай точные матчеры: `toBe()` для примитивов/ссылок, `toEqual()` для структур, `toHaveBeenCalledWith()` для вызовов. Для асинхронных коллбэков всегда `expect.assertions(N)`.
6. **ESM vs CJS:** Jest нативно оптимизирован под CJS. Для ESM используй `--experimental-vm-modules` + `babel` или `ts-jest` с `useESM: true`. При сомнениях генерируй CJS-совместимые моки.

## 📦 Установка и конфигурация
```bash
npm i -D jest @types/jest @jest/globals ts-jest jest-environment-jsdom
npm i -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### `jest.config.ts`
```ts
import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
preset: 'ts-jest',
testEnvironment: 'jsdom',
setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/*.stories.tsx'],
coverageThreshold: { global: { branches: 80, functions: 80, lines: 80, statements: 80 } },
transform: { '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true, useESM: true }] },
extensionsToTreatAsEsm: ['.ts', '.tsx']
}
export default config
```

## 🧱 Архитектура и Паттерны
| Задача | Паттерн | Примечание |
|--------|---------|------------|
| Юнит-тест логики | `jest.fn()` + `mockReturnValue` | Изолируй чистые функции и хуки от UI |
| Интеграция UI | `@testing-library/react` + `userEvent` | Тестируй поведение, а не реализацию |
| API/Внешние сервисы | `jest.mock('axios')` или `msw` | `msw` предпочтительнее для сложных сценариев |
| Частичный мок | `jest.spyOn(module, 'fn')` | Позволяет переопределять только нужные методы |
| Сброс состояния | `jest.clearAllMocks()` | Очищает вызовы/результаты, но не имплементацию |

```tsx
// ✅ Правильная работа с моками и асинхронностью
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import * as api from '@/api/users'
import { UserProfile } from '@/components/UserProfile'

jest.mock('@/api/users')
const mockedApi = api as jest.Mocked<typeof api>

describe('UserProfile', () => {
beforeEach(() => {
jest.clearAllMocks()
})

it('загружает и отображает данные пользователя', async () => {
mockedApi.fetchUser.mockResolvedValue({ id: '1', name: 'Алекс', role: 'admin' })

render(<UserProfile userId="1" />)

expect(screen.getByText('Загрузка...')).toBeInTheDocument()

await waitFor(() => {
expect(mockedApi.fetchUser).toHaveBeenCalledWith('1')
expect(screen.getByText('Алекс')).toBeInTheDocument()
})
})
})
```

## ⚡ Производительность и Надежность
- **Очистка моков:** `clearAllMocks()` (сброс истории вызовов) vs `resetAllMocks()` (сброс реализации) vs `restoreAllMocks()` (возврат оригинала). Выбирай осознанно.
- **Параллелизм:** Jest запускает тесты параллельно. Избегай глобальных мутаций (`process.env`, `globalThis`) без изоляции. Используй `jest.isolateModules()` если нужно.
- **Снапшоты:** Применяй только для регрессионного тестирования сложных UI/данных. Не тестируй бизнес-логику через снапшоты.
- **Отладка:** `--detectOpenHandles` находит утечки таймеров/подписок. `--runInBand` для последовательного запуска при отладке.
- **Таймауты:** Глобально задавай `testTimeout: 5000` в конфиге. `jest.setTimeout()` используй только для специфичных интеграционных тестов.
- **Покрытие:** Не гонись за 100%. Покрывай критические пути, граничные условия и обработку ошибок. `--coverage` должен быть быстрым.

## 📝 Чек-лист перед коммитом
- [ ] Нет `done`, все асинхронные тесты через `async/await` + `waitFor`
- [ ] Моки изолированы, `clearAllMocks()` вызывается в `beforeEach`
- [ ] Строгая типизация моков (`jest.MockedFunction`, `jest.Mocked`)
- [ ] `expect.assertions(N)` или `expect().toHaveBeenCalled()` для коллбэков
- [ ] Нет `skip`/`only`/`todo` в основной ветке
- [ ] DOM-матчеры импортированы из `@testing-library/jest-dom` в `setup.ts`
- [ ] Снапшоты обновлены осознанно, не содержат динамических дат/ID
- [ ] Тесты не зависят от порядка выполнения или глобального состояния
- [ ] Покрытие критических модулей >80%, ложноположительные assertions отсутствуют

## 💡 Шаблон генерации (Agent Template)
```ts
// hooks/__tests__/useAuth.test.ts
import { renderHook, act } from '@testing-library/react'
import { jest, expect, describe, it, beforeEach } from '@jest/globals'
import * as authApi from '@/lib/auth'
import { useAuth } from '../useAuth'

// Мокируем внешний модуль
jest.mock('@/lib/auth', () => ({
login: jest.fn(),
logout: jest.fn()
}))

const mockedAuth = authApi as jest.Mocked<typeof authApi>

describe('useAuth', () => {
beforeEach(() => {
jest.clearAllMocks()
})

it('успешная аутентификация обновляет состояние', async () => {
const mockUser = { id: '1', name: 'Test User' }
mockedAuth.login.mockResolvedValue(mockUser)

const { result } = renderHook(() => useAuth())

expect(result.current.isLoading).toBe(false)
expect(result.current.user).toBeNull()

// Асинхронное действие оборачиваем в act (если нужно, RTL часто делает это автоматически)
await act(async () => {
await result.current.login('user', 'pass')
})

expect(mockedAuth.login).toHaveBeenCalledWith('user', 'pass')
expect(result.current.isLoading).toBe(false)
expect(result.current.user).toEqual(mockUser)
})

it('обработка ошибки сети не ломает приложение', async () => {
mockedAuth.login.mockRejectedValue(new Error('Network Error'))

const { result } = renderHook(() => useAuth())

await act(async () => {
await result.current.login('user', 'pass')
})

expect(result.current.error).toBe('Network Error')
expect(result.current.user).toBeNull()
})
})
```

```tsx
// components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button', () => {
it('вызывает onClick при клике и блокирует повторные нажатия', async () => {
const handleClick = jest.fn()
render(<Button onClick={handleClick}>Click me</Button>)
const btn = screen.getByRole('button', { name: /click me/i })
const user = userEvent.setup()

await user.click(btn)
expect(handleClick).toHaveBeenCalledTimes(1)

// Проверка disabled-состояния после клика (если логика такая есть)
expect(btn).toBeDisabled()
await user.click(btn)
expect(handleClick).toHaveBeenCalledTimes(1)
})
})
```