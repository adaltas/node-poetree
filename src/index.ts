import { mutate } from "mixme";

const getIndexInTree = <U extends string, V extends string>(
  tree: PoetreeBranch<PoetreeDocument<U, V>, U, V>[],
  property: U,
  el: string | number,
) => {
  for (let i = 0; i < tree.length; i++) {
    const doc = tree[i];
    if (doc[property][doc[property].length - 1] === el) return i;
  }
};

type PoetreeDocument<U extends string, V extends string> = {
  [P in U]: (string | number)[];
} & {
  [Q in V]?: (string | number)[];
};

type PoetreeBranch<
  T extends PoetreeDocument<U, V>,
  U extends string,
  V extends string,
> = {
  children: PoetreeBranch<T, U, V>[];
} & {
  [key in U | V]: (string | number)[];
} & Partial<Omit<T, U | V>>;

/**
 * Organize document as a tree using slug and slug_relative attribute and
 * placing child documents inside a children attribute.
 */
const tree = function <
  T extends PoetreeDocument<U, V>,
  U extends string,
  V extends string = U,
>(
  documents: T[],
  options: {
    property: U;
    relative?: V;
  },
): PoetreeBranch<T, U, V>[] {
  const property = options.property;
  const tree: PoetreeBranch<T, U, V>[] = [];
  const relative = options.relative ?? property;
  let rootInit = false;
  let root: (string | number)[] = [];
  documents
    // Find shared trunk
    .map((document) => {
      if (!rootInit) {
        root = document[property].slice(0, document[property].length - 1);
        rootInit = true;
      }
      for (let i = 0; i < root.length; i++) {
        if (root[i] !== document[property][i]) {
          root = root.slice(0, i);
        }
      }
      return document;
    })
    // Strip slug from root
    .map((document) => {
      return {
        ...document,
        [relative]: document[property].slice(
          root.length,
          document[property].length,
        ),
      };
    })
    // Insert each document into the tree
    .map((document) => {
      let ltree = tree;
      for (let i = 0; i < document[relative].length; i++) {
        let treeIndex = getIndexInTree(ltree, property, document[relative][i]);
        // Document not yet inside the tree
        if (treeIndex === undefined) {
          treeIndex = ltree.length;
          const propertyValue: (string | number)[] = [
            ...root,
            ...document[relative].slice(0, i + 1),
          ];
          const propertyRelativeValue: (string | number)[] = document[
            relative
          ].slice(0, i + 1);
          const newBranch = {
            [property]: propertyValue,
            [relative]: propertyRelativeValue,
            children: [] as PoetreeBranch<T, U, V>[],
          } as PoetreeBranch<T, U, V>;
          ltree.push(newBranch); // as PoetreeBranch<T, U, V>
        }
        // Document
        if (i == document[relative].length - 1) {
          mutate(ltree[treeIndex], document);
        } else {
          // Parent
          ltree = ltree[treeIndex].children;
        }
      }
    });
  return tree;
};

export { tree };
