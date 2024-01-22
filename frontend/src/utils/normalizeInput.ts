/**
 * Normalize to search and compare strings:
 * - normalize unicode
 * - remove diacritics
 * - to lowercase
 */
export function normalizeInput(toNormalize: string) {
    return toNormalize
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
}