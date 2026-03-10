export type ToastType = 'success' | 'error' | 'info';

export function showToast(message: string, type: ToastType = 'info') {
  const id = Math.random().toString(36);
  const event = new CustomEvent('toast', {
    detail: { id, message, type },
  });
  window.dispatchEvent(event);
  return id;
}

export function removeToast(id: string) {
  const event = new CustomEvent('toastRemove', { detail: { id } });
  window.dispatchEvent(event);
}
