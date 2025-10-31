export function createSlug(str) {
  return str
    .replace(/\//g, '-') // convert slashes to hyphens
    .replace(/[^a-zA-Z0-9\s-]/g, '') // remove all except letters, numbers, spaces, hyphens
    .replace(/-{2,}/g, '-') // collapse multiple hyphens into one
    .trim() // trim leading/trailing whitespace
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // ensure no double hyphens
    .toLowerCase()
}
