export function slugifyHandle(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}
