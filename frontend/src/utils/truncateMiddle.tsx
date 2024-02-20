export function truncateMiddle(
  toTruncate: string,
  length: number,
  separator: string = '[..]',
): string {
  if (!toTruncate) {
    return '';
  }
  if (toTruncate.length <= length) {
    return toTruncate;
  }
  const toShow = length - separator.length;
  const pre = Math.ceil(toShow / 2);
  const post = Math.floor(toShow / 2);

  return (
    toTruncate.substring(0, pre) +
    separator +
    toTruncate.substring(toTruncate.length - post)
  );
}
