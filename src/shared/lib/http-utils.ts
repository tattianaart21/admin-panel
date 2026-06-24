export function cleanParams<T>(params: T) {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    const typedKey = key as keyof typeof params;

    if (params[typedKey] !== undefined && params[typedKey] !== "") {
      searchParams.set(key, `${params[typedKey]}`);
    }
  }

  return searchParams.toString();
}
