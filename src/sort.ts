import { get, PoetreeDocGet } from "./get";

export type PoetreeDocSort<
  SLUG extends string,
  SORT extends string | string[] | undefined,
> = {
  [P in SLUG]: (string | number)[];
} & (SORT extends string[]
  ? PoetreeDocGet<SORT>
  : SORT extends string
    ? { [Q in SORT]?: string | number }
    : Record<never, never>);

export type PoetreeSortOptionPre<T> = (a: T, b: T) => 0 | -1 | 1;

export function sort<
  T extends PoetreeDocSort<U, SORT>,
  U extends string,
  SORT extends string | string[] | undefined,
>(
  documents: T[],
  options: {
    conflict?: boolean;
    slug: U;
    sort?: SORT;
    pre?: PoetreeSortOptionPre<T>;
  },
) {
  const slug = options.slug;
  const sort =
    options.sort === undefined
      ? undefined
      : Array.isArray(options.sort)
        ? options.sort
        : [options.sort];
  const conflict = options.conflict ?? false;
  const slugSortMap = new Map<string, string | number>();
  return documents
    .map((document) => {
      const key = JSON.stringify(document[slug]);
      if (conflict && slugSortMap.has(key)) {
        throw Error(
          `POETREE_CONFLICT: found conflicting document path \`${key}\`.`,
        );
      }
      slugSortMap.set(
        key,
        sort !== undefined
          ? (get(
              document,
              sort as (string | number)[],
              document[slug].slice(-1)[0],
            ) as string | number)
          : document[slug].slice(-1)[0],
      );
      return document;
    })
    .sort((a, b) => {
      if (options.pre !== undefined) {
        const compare = options.pre(a, b);
        if (compare === -1 || compare === 1) return compare;
      }
      const slugA = a[slug].map(
        (item, i) =>
          slugSortMap.get(JSON.stringify(a[slug].slice(0, i + 1))) ?? item,
      );
      const slugB = b[slug].map(
        (item, i) =>
          slugSortMap.get(JSON.stringify(b[slug].slice(0, i + 1))) ?? item,
      );
      if (slugA < slugB) {
        return -1;
      }
      if (slugA > slugB) {
        return 1;
      }
      return 0;
    });
}
