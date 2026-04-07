import { createToaster } from "@chakra-ui/react";

/**
 * Глобальный экземпляр toaster для всего приложения
 * Все компоненты должны использовать этот toaster для уведомлений
 */
export const toaster = createToaster({
  placement: "top-end",
  duration: 3000,
  gap: 3,
});
