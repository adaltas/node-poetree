/**
 * Extract the returned type from a document based after traversing its slug.
 */
export type PoetreeGetDeep<SRC, SLUG, DEF = undefined> = SLUG extends [
  infer H,
  ...infer R,
]
  ? SRC extends unknown[]
    ? H extends number
      ? SRC[H] extends never
        ? DEF
        : PoetreeGetDeep<SRC[number], R, DEF>
      : DEF
    : H extends keyof SRC
      ? PoetreeGetDeep<SRC[H], R, DEF>
      : DEF
  : SRC;

export type PoetreeDocGet<SLUG extends (string | number)[]> = SLUG extends [
  infer H,
  ...infer R extends (string | number)[],
]
  ? H extends keyof PoetreeDocGet<R>
    ? { [P in H]: PoetreeDocGet<R> }
    : Record<never, never>
  : unknown;

export function get<
  T extends PoetreeDocGet<SLUG>,
  SLUG extends (string | number)[],
  DEF = undefined,
>(
  document: T,
  slug: readonly [...SLUG],
  defaultValue?: DEF,
): PoetreeGetDeep<T, SLUG, DEF> {
  if (slug.length === 0) {
    return (document ?? defaultValue) as PoetreeGetDeep<T, SLUG, DEF>;
  }
  if (document === null || typeof document !== "object")
    return defaultValue as PoetreeGetDeep<T, SLUG, DEF>;
  const [a, ...b] = slug;
  return get(
    document[a as keyof T] as PoetreeDocGet<SLUG>,
    b,
    defaultValue,
  ) as PoetreeGetDeep<T, SLUG, DEF>;
}
