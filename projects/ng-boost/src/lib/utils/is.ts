export function isObject(obj: any) {
  const type = typeof obj;
  return !Array.isArray(obj) && (type === 'function' || type === 'object' && !!obj);
}
