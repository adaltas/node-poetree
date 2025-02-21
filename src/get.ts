export type PoetreeGetDeep<SRC, SLUG, DEF = undefined> = SLUG extends [
  infer H,
  ...infer R,
]
  ? H extends keyof SRC
    ? PoetreeGetDeep<SRC[H], R, DEF>
    : DEF
  : SRC;

export type PoetreeDocGet<SLUG extends (string | number)[]> = SLUG extends [
  infer H extends string,
  ...infer R extends string[],
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
  const [a, ...b] = slug;
  return get(
    document[a as keyof T] as PoetreeDocGet<SLUG>,
    b,
    defaultValue,
  ) as PoetreeGetDeep<T, SLUG, DEF>;
}
