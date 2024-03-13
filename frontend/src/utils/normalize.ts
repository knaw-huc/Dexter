/**
 * Normalize to search and compare strings:
 * - normalize unicode
 * - remove diacritics
 * - to lowercase
 */
export function normalize(input: string) {
  return input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}
