export function slugifyName(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove punctuation
    .replace(/\s+/g, "-")         // spaces to hyphen
    .replace(/-+/g, "-")          // collapse hyphens
    .slice(0, 32) || "member";    // safety fallback
}
 
/**
 * Given a base slug and a list of existing slugs, choose the next available.
 * e.g. base "ama-k" with existing ["ama-k","ama-k1"] -> "ama-k2"
 */
export function nextAvailableSlug(base: string, existing: string[]) {
  const set = new Set(existing);
  if (!set.has(base)) return base;
 
  let n = 1;
  while (set.has(`${base}${n}`)) n += 1;
  return `${base}${n}`;
}