type GetDeep<SRC, SLUG> = SLUG extends [infer H, ...infer R]
  ? H extends keyof SRC
    ? GetDeep<SRC[H], R>
    : undefined
  : SRC;

type Doc<SLUG extends string[]> = SLUG extends [
  infer H extends string,
  ...infer R extends string[],
]
  ? H extends keyof Doc<R>
    ? { [P in H]: Doc<R> }
    : Record<never, never>
  : unknown;

export function get<T extends Doc<SLUG>, SLUG extends string[]>(
  document: T,
  slug: readonly [...SLUG],
): GetDeep<T, SLUG> {
  if (slug.length === 0) {
    return document as GetDeep<T, SLUG>;
  }
  const [a, ...b] = slug;
  return get(document[a as keyof T] as Doc<SLUG>, b) as GetDeep<T, SLUG>;
}
