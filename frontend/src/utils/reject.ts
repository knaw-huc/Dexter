export function reject(msg: string) {
  return !window.confirm(msg);
}
