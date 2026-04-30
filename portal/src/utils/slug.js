/**
 * Gera um slug URL-friendly a partir de uma string.
 * Ex: "Pensamento Computacional" → "pensamento-computacional"
 */
export function getSlug(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-').replace(/^-|-$/g, '');
}
