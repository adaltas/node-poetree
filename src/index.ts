import { mutate } from "mixme";
import { get, PoetreeDocGet } from "./get";

const getIndexInTree = <
  U extends string,
  X extends string,
  V extends string,
  SORT extends string,
>(
  tree: PoetreeBranch<PoetreeDocument<U, SORT>, U, X, V, SORT>[],
  slug: U,
  el: string | number,
) => {
  for (let i = 0; i < tree.length; i++) {
    const doc = tree[i];
    if (doc[slug][doc[slug].length - 1] === el) return i;
  }
};

type PoetreeDocument<
  SLUG extends string,
  SORT extends string | string[] | undefined,
> = {
  [P in SLUG]: (string | number)[];
} & (SORT extends string[]
  ? PoetreeDocGet<SORT>
  : SORT extends string
    ? { [Q in SORT]?: string | number }
    : Record<never, never>);

type PoetreeBranch<
  T extends PoetreeDocument<U, SORT>,
  U extends string,
  X extends string,
  V extends string,
  SORT extends string | string[] | undefined,
> = {
  [key in X]: PoetreeBranch<T, U, X, V, SORT>[];
} & {
  [key in U | V]: (string | number)[];
} & Partial<Omit<T, U | X | V>>;

const sort = function <
  T extends PoetreeDocument<U, SORT>,
  U extends string,
  SORT extends string | string[] | undefined,
>(
  documents: T[],
  options: {
    conflict?: boolean;
    slug: U;
    sort?: SORT;
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
};

/**
 * Organize document as a tree using property and relative attribute and
 * placing child documents inside a children attribute.
 */
const tree = function <
  T extends PoetreeDocument<U, SORT>,
  U extends string,
  SORT extends string | undefined,
  X extends string = "children",
  V extends string = U,
>(
  documents: T[],
  options: {
    conflict?: boolean;
    slug: U;
    children?: X;
    relative?: V;
    sort?: SORT;
  },
): PoetreeBranch<T, U, X, V, SORT>[] {
  const slug = options.slug;
  const children = options.children ?? "children";
  const relative = options.relative ?? slug;
  const tree: PoetreeBranch<T, U, X, V, SORT>[] = [];
  let rootInit = false;
  let root: (string | number)[] = [];
  sort(documents, {
    slug: slug,
    conflict: options.conflict,
    sort: options.sort,
  })
    // Find shared trunk
    .map((document) => {
      if (!rootInit) {
        root = document[slug].slice(0, document[slug].length - 1);
        rootInit = true;
      }
      for (let i = 0; i < root.length; i++) {
        if (root[i] !== document[slug][i]) {
          root = root.slice(0, i);
        }
      }
      return document;
    })
    // Strip slug from root
    .map((document) => {
      return {
        ...document,
        [relative]: document[slug].slice(root.length, document[slug].length),
      };
    })
    // Insert each document into the tree
    .map((document) => {
      let ltree = tree;
      for (let i = 0; i < document[relative].length; i++) {
        let treeIndex = getIndexInTree(ltree, slug, document[relative][i]);
        // Document not yet inside the tree
        if (treeIndex === undefined) {
          treeIndex = ltree.length;
          const slugValue: (string | number)[] = [
            ...root,
            ...document[relative].slice(0, i + 1),
          ];
          const relativeValue: (string | number)[] = document[relative].slice(
            0,
            i + 1,
          );
          const newBranch = {
            [slug]: slugValue,
            [relative]: relativeValue,
            [children]: [],
          } as PoetreeBranch<T, U, X, V, SORT>;
          ltree.push(newBranch);
        }
        // Document
        if (i == document[relative].length - 1) {
          mutate(ltree[treeIndex], document);
        } else {
          // Parent
          ltree = ltree[treeIndex][children as X];
        }
      }
    });
  return tree;
};

export type { PoetreeDocGet };
export { get, sort, tree };
