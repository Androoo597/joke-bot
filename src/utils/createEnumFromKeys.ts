export function createEnumFromKeys<T extends Record<string, unknown>>(
  obj: T,
): { [K in keyof T]: K } {
  const enumObj = {} as { [K in keyof T]: K };
  (Object.keys(obj) as Array<keyof T>).forEach((key) => {
    enumObj[key] = key;
  });
  return enumObj;
}
