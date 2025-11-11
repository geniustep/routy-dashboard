import { message, notification } from 'ant-design-vue'

export function useNotification() {
  function success(msg: string, description?: string) {
    if (description) {
      notification.success({
        message: msg,
        description,
      })
    } else {
      message.success(msg)
    }
  }

  function error(msg: string, description?: string) {
    if (description) {
      notification.error({
        message: msg,
        description,
      })
    } else {
      message.error(msg)
    }
  }

  function warning(msg: string, description?: string) {
    if (description) {
      notification.warning({
        message: msg,
        description,
      })
    } else {
      message.warning(msg)
    }
  }

  function info(msg: string, description?: string) {
    if (description) {
      notification.info({
        message: msg,
        description,
      })
    } else {
      message.info(msg)
    }
  }

  return {
    success,
    error,
    warning,
    info,
  }
}
