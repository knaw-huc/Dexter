export function cancel(msg: string) {
  return !window.confirm(msg);
}
